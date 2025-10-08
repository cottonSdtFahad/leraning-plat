import { forwardRef } from "react";

const FormInput = forwardRef(
  (
    { label, error, id, className = "", labelClassName = "", ...props },
    ref
  ) => {
    const baseInputClass = `appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
      error
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300"
    }`;

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <input id={id} ref={ref} className={baseInputClass} {...props} />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
