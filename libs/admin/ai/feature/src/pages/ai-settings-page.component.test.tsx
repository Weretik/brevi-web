import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AiSettingsPage } from './ai-settings-page';

const fixture = vi.hoisted(() => ({
  settings: null as Record<string, unknown> | null,
  update: vi.fn(),
  setKey: vi.fn(),
  test: vi.fn(),
  prompt: vi.fn(),
  remove: vi.fn(),
  mutation: (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => fn(arg) }),
    { isLoading: false },
  ],
}));

const base = {
  hasKey: false,
  keyHint: null,
  enabled: false,
  fastModel: 'gpt-6-luna',
  fastInputPrice: 0.1,
  fastOutputPrice: 0.5,
  strongModel: 'gpt-6.1-terra',
  strongInputPrice: 1,
  strongOutputPrice: 5,
  monthlyLimitUsd: 5,
  version: 0,
  updatedBy: null,
  updatedAt: null,
  usage: { month: '2026-11', requests: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 },
  prompts: [
    {
      key: 'purchase-invoices',
      title: 'Умови розпізнавання рахунків',
      baseText: 'You read one Ukrainian supplier invoice.',
      text: '',
      updatedBy: null,
      updatedAt: null,
    },
  ],
};

vi.mock('@admin/ai/data-access', () => ({
  useGetAiSettingsQuery: () => ({
    data: fixture.settings,
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useUpdateAiSettingsMutation: fixture.mutation((arg) => fixture.update(arg)),
  useSetAiKeyMutation: fixture.mutation((arg) => fixture.setKey(arg)),
  useRemoveAiKeyMutation: fixture.mutation((arg) => fixture.remove(arg)),
  useTestAiConnectionMutation: fixture.mutation((arg) => fixture.test(arg)),
  useUpdateAiPromptMutation: fixture.mutation((arg) => fixture.prompt(arg)),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('AiSettingsPage', () => {
  it('says why the AI does not work and saves a key without showing it again', async () => {
    fixture.settings = base;
    fixture.setKey.mockResolvedValue({ ...base, hasKey: true, keyHint: '1234' });
    render(<AiSettingsPage />);

    expect(screen.getByText('Не працює')).toBeInTheDocument();
    expect(screen.getByText(/ШІ не читає рахунки: немає ключа openai/)).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /ШІ увімкнено/ })).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText('Ключ OpenAI', { selector: 'input' }),
      'sk-proj-abcdefghijklmnopqrstuvwxyz1234',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти ключ' }));

    expect(fixture.setKey).toHaveBeenCalledWith('sk-proj-abcdefghijklmnopqrstuvwxyz1234');
    const card = screen.getByRole('region', { name: 'Ключ OpenAI' });
    expect(
      await within(card).findByText('Ключ збережено (…1234). Перевірте моделі нижче.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Ключ OpenAI', { selector: 'input' })).toHaveValue('');
  });

  it('saves the switch at once and the limit with its own button', async () => {
    fixture.settings = { ...base, hasKey: true, keyHint: '1234', version: 2 };
    fixture.update.mockResolvedValue(fixture.settings);
    render(<AiSettingsPage />);

    await userEvent.click(screen.getByRole('switch', { name: 'ШІ увімкнено' }));
    await waitFor(() =>
      expect(fixture.update).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true, monthlyLimitUsd: 5, version: 2 }),
      ),
    );

    const save = screen.getByRole('button', { name: 'Зберегти ліміт' });
    expect(save).toBeDisabled();
    const limit = screen.getByLabelText('Ліміт на місяць, $');
    await userEvent.clear(limit);
    await userEvent.type(limit, '20,5');
    await userEvent.click(save);

    await waitFor(() =>
      expect(fixture.update).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false, monthlyLimitUsd: 20.5, version: 2 }),
      ),
    );
    expect(await screen.findByText('Ліміт збережено.')).toBeInTheDocument();
  });

  it('checks a model and changes prices in the side panel', async () => {
    fixture.settings = { ...base, hasKey: true, keyHint: '1234', enabled: true, version: 3 };
    fixture.update.mockResolvedValue(fixture.settings);
    fixture.test.mockResolvedValue({
      tier: 'Strong',
      model: 'gpt-6.1-terra',
      inputTokens: 9,
      outputTokens: 3,
      costUsd: 0.00002,
    });
    render(<AiSettingsPage />);

    expect(screen.getByText('Працює')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Перевірити gpt-6.1-terra' }));
    expect(fixture.test).toHaveBeenCalledWith('Strong');
    expect(await screen.findByText(/gpt-6.1-terra працює/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Змінити' }));
    const panel = screen.getByRole('dialog', { name: 'Моделі й ціни' });
    const price = within(panel).getAllByLabelText('Вхід, $')[0]!;
    await userEvent.clear(price);
    await userEvent.type(price, '0,2');
    await userEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(fixture.update).toHaveBeenCalledWith(
        expect.objectContaining({ fastInputPrice: 0.2, enabled: true, version: 3 }),
      ),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('marks a reached limit as the reason', () => {
    fixture.settings = {
      ...base,
      hasKey: true,
      enabled: true,
      usage: { ...base.usage, costUsd: 5 },
    };
    render(<AiSettingsPage />);
    expect(screen.getByText(/вичерпано ліміт місяця/)).toBeInTheDocument();
  });

  it('adds, changes and deletes recognition conditions one by one', async () => {
    fixture.settings = {
      ...base,
      prompts: [{ ...base.prompts[0], text: '- Бистров завжди без ПДВ' }],
    };
    fixture.prompt.mockResolvedValue({});
    render(<AiSettingsPage />);

    const conditions = screen.getByRole('list', { name: 'Умови' });
    expect(within(conditions).getByText('Бистров завжди без ПДВ')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Додати умову' }));
    await userEvent.type(screen.getByLabelText('Нова умова'), 'Номер без №');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(fixture.prompt).toHaveBeenLastCalledWith({
      key: 'purchase-invoices',
      text: '- Бистров завжди без ПДВ\n- Номер без №',
    });
    expect(await screen.findByText('Умову додано.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Змінити умову 1' }));
    const field = screen.getByLabelText('Умова 1');
    await userEvent.clear(field);
    await userEvent.type(field, 'Бистров без ПДВ');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(fixture.prompt).toHaveBeenLastCalledWith({
      key: 'purchase-invoices',
      text: '- Бистров без ПДВ',
    });

    await userEvent.click(await screen.findByRole('button', { name: 'Видалити умову 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Видалити' }));
    expect(fixture.prompt).toHaveBeenLastCalledWith({ key: 'purchase-invoices', text: '' });
  });

  it('shows the base instruction for reading only', async () => {
    fixture.settings = base;
    render(<AiSettingsPage />);

    await userEvent.click(screen.getByRole('button', { name: /Базова інструкція/ }));
    const instruction = screen.getByLabelText('Текст базової інструкції');
    expect(instruction).toHaveTextContent('You read one Ukrainian supplier invoice.');
    expect(within(instruction).queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('asks to write a condition before saving an empty one', async () => {
    fixture.settings = base;
    render(<AiSettingsPage />);

    expect(screen.getByText(/Умов немає/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Додати умову' }));
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(screen.getByText('Напишіть умову')).toBeInTheDocument();
    expect(fixture.prompt).not.toHaveBeenCalled();
  });
});
