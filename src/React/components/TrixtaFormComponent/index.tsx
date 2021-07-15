import { FormProps, withTheme } from '@rjsf/core';
import * as React from 'react';
import { config } from '../../../config';
import { DefaultUnknownType } from '../../types/common';

const ThemedForm = withTheme(config.props);
export interface TrixtaReactJsonSchemaFormProps<TFormData>
  extends FormProps<TFormData> {
  submittable?: boolean;
}

function TrixtaFormComponent<TFormData = DefaultUnknownType>({
  submittable = true,
  onSubmit,
  idPrefix,
  schema,
  formData,
  uiSchema,
  formContext,
}: TrixtaReactJsonSchemaFormProps<TFormData>): JSX.Element {
  if (ThemedForm) {
    return (
      <ThemedForm
        idPrefix={idPrefix}
        onSubmit={onSubmit}
        schema={schema}
        formContext={formContext}
        formData={formData}
        {...config.props}
        uiSchema={uiSchema}
      >
        {submittable ? (
          <>
            <button type="submit" className="btn btn-info">
              Submit
            </button>
          </>
        ) : (
          <></>
        )}
      </ThemedForm>
    );
  }
  return (
    <>
      Invalid Trixta Form Provided. Please set a valid JsonSchemaForm with
      setJsonSchemaForm function
    </>
  );
}

export default TrixtaFormComponent;
