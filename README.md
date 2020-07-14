# ADL Rules Template

A Github template that lets you create your own rules plugin for ADL.

# How to use

Click on the [![Use this template](https://img.shields.io/badge/-Use%20this%20template-brightgreen)](https://github.com/azure/adl-rules-template/generate) button to create a new repo that will start with the same files and folders as this repo.

# Linter Rule

A rule for ADL is defined in the following way:

```js
export default <Rule> {
  activation: "edit", // demand or disable
  id: "required-read-only-properties",
  meta: {
    severity: "error", // warning, hint , info
    description: "A model property cannot be both readOnly and required. A readOnly property is something that the server sets when returning the model object while required is a property to be set when sending it as a part of the request body.",
    documentationUrl: "https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2056-requiredreadonlyproperties"
  },
  onProperty: (model, property) => {
    if (property.readOnly && property.required) {
      return {
        message: 'A model property cannot be both readOnly and required',
        suggestions: [
          {
            description: 'Remove readonly keyword.',
            fix: () => {
              property.readOnly = false;
            }
          },
          {
            description: 'Mark as optional.',
            fix: () => {
              property.required = false;
            }
          }
        ]
      };
    }

    return;
  }
}
```

## Rule Anatomy

- activation: Specifies the condition for the rule to be run. Possible values are "edit", "demand" and "disabled".
- id: The name of the rules. It could either be a code or a unique identifier among a set of rules. 
- data (optional): This field is used to pass any kind of object to be used by the linter. This allows to parameterize the check. For example, this could be used to override regular expressions used to check text.
- meta: Contains information about the rule.
    - type: There are four type of rules: warnings, errors, hints and information. The most used are warnings and errors. Warnings are things that could result in functional, but low quality generated code. In the other hand errors will result in things that are stricly forbidden.
    - description: A description of the rule. It can include what it forbids, warns about and the reason it exists.
    - documentationUrl (optional): This is link to the full documentation of the rule. 
- on\<Element>: This function returns a `RuleResult`. Depending on the rule there can be multiple on\<Element> functions. For example:

``` js
  meta: 
  ...
  onOperation: (model, operation, data) => {
    ....
  },
  onProperty: (model, property, data) => {
    ...
  }
```

### RuleResult

A rule result contains information about fixing the error in `message` and a fix. The fix is optional depending on the rule. The structure is:
 
- message: This describes the warning or error. 
- suggestion: This contains an array of fixes.

In the rule above, the rule result is:

``` js
{
  message: `The property '${property.name}' is marked both as readOnly and required, which is forbidden.`,
  suggestion: [
    {
      description: "Remove the readOnly keyword.",
      fix: () => {
        property.readonly = false;
      }
    },
    {
      description: "Mark this property as optional.",
      fix: () => {
        property.required = false;
      }
    }
  ]
}
``` 

### Fix

A fix contains:

- description: The description of the fix to be applied.
- fix: This is a function that modifies the element for which the rule is operating on.

In the example above a fix is:

``` js
{
  description: "Remove the readOnly keyword.",
  fix: () => {
    property.readonly = false;
  }
}
```


### References
- https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#error-vs-warning
- https://eslint.org/docs/developer-guide/working-with-rules


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
