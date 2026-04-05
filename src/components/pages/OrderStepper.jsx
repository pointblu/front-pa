import React from "react";

const STEPS = [
  { key: "REQUESTED", label: "En proceso", icon: "fas fa-share" },
  { key: "ROUTED", label: "En ruta", icon: "fas fa-shipping-fast" },
  { key: "DELIVERED", label: "Entregado", icon: "fas fa-check" },
];

export function OrderStepper({ status }) {
  const isCanceled = status === "CANCELED";
  const currentIndex = isCanceled
    ? 0
    : STEPS.findIndex((s) => s.key === status);

  return (
    <div className="order-stepper">
      {STEPS.map((step, i) => {
        const isCompleted = !isCanceled && i < currentIndex;
        const isCurrent = !isCanceled && i === currentIndex;
        const isCanceledHere = isCanceled && i === 0;

        let cls = "stepper-step";
        if (isCompleted) cls += " step-completed";
        else if (isCurrent) cls += " step-current";
        else if (isCanceledHere) cls += " step-canceled";

        return (
          <React.Fragment key={step.key}>
            <div className={cls}>
              <div className="stepper-circle">
                {isCompleted ? (
                  <i className="fas fa-check" />
                ) : isCanceledHere ? (
                  <i className="fas fa-times" />
                ) : isCurrent ? (
                  <i className={step.icon} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="stepper-label">{step.label}</span>
              {isCanceledHere && (
                <span className="stepper-sublabel">Cancelado</span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`stepper-connector${isCompleted ? " connector-done" : ""}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
