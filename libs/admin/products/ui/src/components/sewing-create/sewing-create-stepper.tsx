import { sewingCreateStepInfo, sewingCreateSteps } from '@admin/products/model';
import { Box, Step, StepButton, Stepper, Typography } from '@mui/material';

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
    <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
      <Stepper
        nonLinear
        activeStep={step - 1}
        aria-label="Кроки створення моделі"
        sx={{ minWidth: 640 }}
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
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
    </Box>
  );
}
