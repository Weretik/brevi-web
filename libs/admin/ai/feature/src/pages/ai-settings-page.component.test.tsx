import { cleanup, render, screen, waitFor } from '@testing-library/react';
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
  it('asks for a key and saves it without showing it again', async () => {
    fixture.settings = base;
    fixture.setKey.mockResolvedValue({ ...base, hasKey: true, keyHint: '1234' });
    render(<AiSettingsPage />);

    expect(screen.getByText(/Ключ OpenAI не додано/)).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'ШІ увімкнено' })).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText('Ключ OpenAI'),
      'sk-proj-abcdefghijklmnopqrstuvwxyz1234',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти ключ' }));

    expect(fixture.setKey).toHaveBeenCalledWith('sk-proj-abcdefghijklmnopqrstuvwxyz1234');
    expect(
      await screen.findByText('Ключ збережено (…1234). Натисніть «Перевірити».'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Ключ OpenAI')).toHaveValue('');
  });

  it('saves models with the version and checks a model', async () => {
    fixture.settings = { ...base, hasKey: true, keyHint: '1234', version: 2 };
    fixture.update.mockResolvedValue(fixture.settings);
    fixture.test.mockResolvedValue({
      tier: 'Strong',
      model: 'gpt-6.1-terra',
      inputTokens: 9,
      outputTokens: 3,
      costUsd: 0.00002,
    });
    render(<AiSettingsPage />);

    expect(screen.getByText(/sk-…1234/)).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Перевірити' })[1]!);
    expect(fixture.test).toHaveBeenCalledWith('Strong');
    expect(await screen.findByText(/модель gpt-6.1-terra працює/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('switch', { name: 'ШІ увімкнено' }));
    const limit = screen.getByLabelText('Ліміт на місяць, $');
    await userEvent.clear(limit);
    await userEvent.type(limit, '10,5');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(fixture.update).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true, monthlyLimitUsd: 10.5, version: 2 }),
      ),
    );
  });

  it('marks a reached limit as a problem', () => {
    fixture.settings = { ...base, usage: { ...base.usage, costUsd: 5 } };
    render(<AiSettingsPage />);
    expect(screen.getByText(/Ліміт цього місяця вичерпано/)).toBeInTheDocument();
  });
});
