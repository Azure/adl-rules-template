import { NamedElement, Rule, RuleResult } from '@azure-tools/adl.core';
export default <Rule>{
  activation: 'edit',
  meta: {
    severity: 'warning',
    description: 'The length of the description is too short.'
  },
  data: {
    minLength: 10,
    maxLength: 500
  },
  onAliasType: (model, alias, data) => checkDescription('alias', alias, data),
  onDeclaredResponseCollections: (model, reponseCollection, data) => checkDescription('reponseCollection', reponseCollection, data),
  onDeclaredResponses: (model, response, data) => checkDescription('response', response, data),
  onDeclaredResults: (model, result, data) => checkDescription('result', result, data),
  onDeclaredParameters: (model, parameter, data) => checkDescription('parameter', parameter, data),
  onEnumType: (model, enumType, data) => checkDescription('enumType', enumType, data),
  onEnumValue: (model, enumValue, data) => checkDescription('enumValue', enumValue, data),
  onModelType: (model, modelType, data) => checkDescription('modelType', modelType, data),
  onOperationGroup: (model, operationGroup, data) => checkDescription('operationGroup', operationGroup, data),
  onOperation: (model, operation, data) => checkDescription('operation', operation, data),
  onProperty: (model, property, data) => checkDescription('property', property, data)
};

function checkDescription(nodeType: string, element: NamedElement<any>, data: any): RuleResult | undefined {
  if (element.description !== undefined) {
    if (element.description.length < data.minLength) {
      return {
        message: `The description '${element.name}' is too short. Minimum number of characters is ${data.minLength}.`,
        range: element.annotations?.get('description')[0].contentRange
      };
    } else if (element.description.length > data.maxLength) {
      return {
        message: `The description '${element.name}' is too long. Maximum number of characters is ${data.maxLength}.`,
        range: element.annotations?.get('description')[0].contentRange
      };
    }
  }

  return;
}
