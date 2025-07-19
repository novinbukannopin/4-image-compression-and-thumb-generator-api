export const extractFormData = ({
  fieldNames,
  formData,
  additionalFields = {},
  trimStrings = true,
  emptyStringToNull = false,
}: {
  fieldNames: string[];
  formData: FormData;
  additionalFields?: Record<string, unknown>;
  trimStrings?: boolean;
  emptyStringToNull?: boolean;
}): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  fieldNames.forEach((field) => {
    let value = formData.get(field);

    if (typeof value === 'string') {
      if (trimStrings) value = value.trim();
      if (emptyStringToNull && value === '') value = null;
    }

    payload[field] = value;
  });

  return { ...payload, ...additionalFields };
};
