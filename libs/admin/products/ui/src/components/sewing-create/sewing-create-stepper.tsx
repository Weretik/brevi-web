import { sewingCreateStepInfo, sewingCreateSteps } from '@admin/products/model';
import { Step, StepButton, Stepper, Typography } from '@mui/material';

import type { SewingCreateStep } from '@admin/products/model';

interface Props {
  step: SewingCreateStep;
  done: readonly SewingCreateStep[];
  /** Steps 2–5 stay closed until the draft is saved. */
  canOpen: (step: SewingCreateStep) => boolean;
  onSelect: (step: SewingCreateStep) => void;
}

/** Five clickable steps of «Нова модель»; done steps are marked, closed ones are disabled. */
export function SewingCreateStepper({ step, done, canOpen, onSelect }: Props) {
  return (
    <Stepper
      nonLinear
      alternativeLabel
      activeStep={step - 1}
      aria-label="Кроки створення моделі"
      // StepButton has negative margins; the padding keeps the edge steps inside the page.
      sx={{ px: 1 }}
    >
      {sewingCreateSteps.map((value) => {
        const info = sewingCreateStepInfo[value];
        return (
          <Step key={value} completed={done.includes(value)} disabled={!canOpen(value)}>
            <StepButton
              onClick={() => onSelect(value)}
              aria-current={value === step ? 'step' : undefined}
              optional={
                info.hint ? (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
                  >
                    {info.hint}
                  </Typography>
                ) : undefined
              }
            >
              {info.title}
            </StepButton>
          </Step>
        );
      })}
    </Stepper>
  );
}
