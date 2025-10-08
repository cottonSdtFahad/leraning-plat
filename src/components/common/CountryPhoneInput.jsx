import { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import { countries } from "../../data/countries";

const CountryPhoneInput = forwardRef(
  (
    {
      label,
      error,
      id,
      value = "",
      onChange,
      onCountryChange,
      defaultCountry = "Bangladesh",
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const dropdownRef = useRef(null);

    const countryList = useMemo(() => countries.en || [], []);

    // Initialize with default country (Bangladesh)
    useEffect(() => {
      const defaultCountryData = countryList.find(
        (c) => c.name === defaultCountry || c.code === defaultCountry
      );
      if (defaultCountryData && !selectedCountry) {
        setSelectedCountry(defaultCountryData);
        if (onCountryChange) {
          onCountryChange(defaultCountryData);
        }
      }
    }, [defaultCountry, countryList, selectedCountry, onCountryChange]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter countries based on search
    const filteredCountries = countryList.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dial_code.includes(searchQuery)
    );

    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      setSearchQuery("");
      if (onCountryChange) {
        onCountryChange(country);
      }
    };

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="flex gap-2">
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-300" : "border-gray-300"
              }`}
              style={{ minWidth: "120px" }}
            >
              {selectedCountry ? (
                <>
                  <img
                    src={selectedCountry.image}
                    alt={selectedCountry.name}
                    className="w-6 h-4 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "inline";
                    }}
                  />
                  <span className="text-xl hidden" style={{ display: "none" }}>
                    {selectedCountry.emoji}
                  </span>
                  <span className="text-sm font-medium">
                    {selectedCountry.dial_code}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-sm text-gray-500">Select</span>
              )}
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute z-50 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {/* Country List */}
                <div className="overflow-y-auto max-h-64">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 text-left transition-colors ${
                          selectedCountry?.code === country.code
                            ? "bg-blue-100"
                            : ""
                        }`}
                      >
                        <img
                          src={country.image}
                          alt={country.name}
                          className="w-6 h-4 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display =
                              "inline";
                          }}
                        />
                        <span
                          className="text-xl hidden flex-shrink-0"
                          style={{ display: "none" }}
                        >
                          {country.emoji}
                        </span>
                        <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                          {country.name}
                        </span>
                        <span className="text-sm text-gray-600 flex-shrink-0">
                          {country.dial_code}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <input
            id={id}
            ref={ref}
            type="tel"
            value={value}
            onChange={onChange}
            className={`flex-1 appearance-none block px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              error
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {selectedCountry && !error && (
          <p className="mt-1 text-xs text-gray-500">
            {selectedCountry.name} ({selectedCountry.dial_code})
          </p>
        )}
      </div>
    );
  }
);

CountryPhoneInput.displayName = "CountryPhoneInput";

export default CountryPhoneInput;
