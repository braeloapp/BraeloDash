"use client";

import React, { useId } from "react";

export function TextField({
  label,
  error,
  hint,
  className = "",
  inputClassName = "",
  id,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
      ) : null}
      <input
        id={fieldId}
        className={`field-control ${error ? "field-control--error" : ""} ${inputClassName}`.trim()}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <p className="field-error">{error}</p> : null}
      {!error && hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className = "",
  selectClassName = "",
  id,
  children,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
      ) : null}
      <select
        id={fieldId}
        className={`field-control ${error ? "field-control--error" : ""} ${selectClassName}`.trim()}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
      {!error && hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  className = "",
  inputClassName = "",
  id,
  rows = 4,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        rows={rows}
        className={`field-control ${error ? "field-control--error" : ""} ${inputClassName}`.trim()}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <p className="field-error">{error}</p> : null}
      {!error && hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}
