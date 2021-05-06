import { FormProps, ThemeProps, withTheme } from '@rjsf/core';
const ThemedForm = withTheme({});
export type TrixtaFormProps<T = any> = Omit<
  ThemeProps<T>,
  | 'schema'
  | 'formData'
  | 'onBlur'
  | 'onChange'
  | 'onError'
  | 'onFocus'
  | 'schema'
  | 'idPrefix'
  | 'onSubmit'
  | 'uiSchema'
>;

const config: {
  trixtaForm:
    | React.ComponentClass<FormProps<any>>
    | React.FunctionComponent<FormProps<any>>;
  props: TrixtaFormProps;
} = {
  trixtaForm: ThemedForm,
  props: {},
};

export function setJsonSchemaFormProps(props: TrixtaFormProps): void {
  config.props = props;
}

export function setJsonSchemaForm(
  form: typeof config.trixtaForm,
  props: TrixtaFormProps,
): void {
  config.trixtaForm = form;
  config.props = props;
}

export { config };
