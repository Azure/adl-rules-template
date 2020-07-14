// This rule suggests three ways to fix an error.
// The user should be able to choose a fix using code actions.
import { Element, Rule, RuleResult } from '@azure-tools/adl.core';
export default <Rule>{
  activation: 'edit',
  meta: {
    severity: 'error',
    description: 'API version must be in the format: yyyy - MM - dd, optionally followed by - preview, - alpha, -beta, -rc, -privatepreview.'
  },
  onAliasType: (model, alias) => checkVersionFormat(alias),
  onDeclaredResponseCollections: (model, reponseCollection) => checkVersionFormat(reponseCollection),
  onDeclaredResponses: (model, response) => checkVersionFormat(response),
  onDeclaredResults: (model, result) =>  checkVersionFormat(result),
  onDeclaredParameters: (model, parameter) => checkVersionFormat(parameter),
  onEnumType: (model, enumType) => checkVersionFormat(enumType),
  onEnumValue: (model, enumValue) => checkVersionFormat(enumValue),
  onModelType: (model, modelType) => checkVersionFormat(modelType),
  onOperationGroup: (model, operationGroup) => checkVersionFormat(operationGroup),
  onOperation: (model, operation) => checkVersionFormat(operation),
  onProperty: (model, property) => checkVersionFormat(property)
};

function *checkVersionFormat(element: Element): Iterable<RuleResult> {
  const getVersionMessage = (tag: string, version: string) => {
    return `
    The ${tag} api version: ${version} does not have the correct format. 
    API version must be in the format: yyyy-mm-dd, optionally followed 
     - preview, -alpha, -beta, -rc, -privatepreview.`
  }

  const versionRegex = /^(20\d{2})-(0[1-9]|1[0-2])-((0[1-9])|[12][0-9]|3[01])(-(preview|alpha|beta|rc|privatepreview))?$/g;
  
  if (element.versionInfo.since !== undefined && !element.versionInfo.since?.match(versionRegex)) {
    yield {
      message: getVersionMessage('@since', element.versionInfo.since),
      range: element.annotations?.get('since')[0].identityRange
    };
  }

  if (element.versionInfo.deleted !== undefined && !element.versionInfo.deleted?.match(versionRegex)) {

    yield {
      message: getVersionMessage('@deleted', element.versionInfo.deleted),
      range: element.annotations?.get('deleted')[0].identityRange
    };
  }

}
