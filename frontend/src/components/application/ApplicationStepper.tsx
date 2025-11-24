import React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Step {
  value: string
  label: string
  Icon: React.ElementType
}

interface ApplicationStepperProps {
  steps: Step[]
  currentStep: string
  onStepClick?: (step: string) => void
  completedSteps?: string[]
  stepsWithErrors?: string[]
}

const ApplicationStepper: React.FC<ApplicationStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  completedSteps = [],
  stepsWithErrors = [],
}) => {
  const currentIndex = steps.findIndex((step) => step.value === currentStep)

  return (
    <div className="w-full py-4">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-4xl mx-auto gap-4 md:gap-0">
        {/* Progress Bar Background (Desktop) */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted hidden md:block " />

        {/* Progress Bar Active (Desktop) */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-jb-primary hidden md:block z-10 transition-all duration-500 ease-in-out"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted =
            completedSteps.includes(step.value) ||
            index < currentIndex
          const isActive = step.value === currentStep
          const hasError = stepsWithErrors.includes(step.value)
          const isClickable =
            onStepClick && (isCompleted || index === currentIndex)

          return (
            <div
              key={step.value}
              className={cn(
                'flex md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto',
                isClickable
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-60 md:opacity-100'
              )}
              onClick={() => {
                if (isClickable) onStepClick(step.value)
              }}
            >
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: hasError
                    ? 'var(--jb-danger)'
                    : isActive || isCompleted
                      ? 'var(--jb-primary)'
                      : 'var(--muted)',
                  borderColor: hasError
                    ? 'var(--jb-danger)'
                    : isActive || isCompleted
                      ? 'var(--jb-primary)'
                      : 'var(--muted)',
                }}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 z-10',
                  isActive || isCompleted || hasError
                    ? 'text-white'
                    : 'text-muted-foreground bg-muted'
                )}
              >
                {isCompleted && !hasError ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.Icon className="w-5 h-5" />
                )}

                {/* Pulse effect for active step */}
                {isActive && !hasError && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-jb-primary opacity-20 animate-ping" />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="flex flex-col md:items-center">
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    hasError
                      ? 'text-jb-danger'
                      : isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground hidden md:block">
                  Step {index + 1}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationStepper
