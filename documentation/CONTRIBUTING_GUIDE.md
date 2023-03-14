# Contributing to Barathon project

In order for your **P**ull **R**equests (**PR**) to be accepted, you need to follow some guidelines.

## Branch naming convention

Your branch need to be named this way :

- `feat/<id>-<short-description>` : if your PR aims to add a new feature to the application
- `fix/<id>-<short-description>` : if your PR aims to fix a bug or an unexpected behavior of the application

Where **\<id>** represents the identification number of the feature or the bug - usually the number of your card, of the form **#xxxxxx**\
And **\<short-description>** briefly describes the task - usually the title of your card.

You can find your card on the **AzureDevOps Board**.

## Commit message convention

Your commit message need to follow a precise schema :

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Commit message _Header_

The header cannot be omitted and must follow this schema :

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Short summary of what happend in the commit in present tense.
  │       │                  Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: A few words (dash-separated) describing the scope of the modification.
  │                          It can be the name of the component, the API route, the module,
  │                          the filename, etc.
  │
  └─⫸ Commit Type: build|ci|chore|docs|feat|fix|perf|refactor|revert|style|test
```

### Commit message _Body_

The body is optionnal, when present, it contains deeper explaination of what the commit _is_ doing (not necessarily _how_). You can add further explainations, stating the motivation of the change, why this change was necessary, things that need to be taken into account, and so on.

### Commit message _Footer_

In the footer you can add a **BREAKING CHANGES** section and/or a **Fixes** section that looks like that :

```
BREAKING CHANGES: <describe here the breaking changes / can be multiline, no blank lines in the descirption>
<BLANK LINE>
Fixes #123
```

### 3rd party tools to help you

You can use the JavaScript tool [commitizen](https://github.com/commitizen/cz-cli) to help you format your commit message.

You can install it globaly on your computer with the command `npm install -g commitizen` (if you have `npm` installed localy on your machine, since it is not bundle in the `Container`).

**Note**: You **MUST NOT** install it in the project, so be careful to correctly add the `-g` flag.

Once the script is installed, `cd` inside the project repository where you have commit message to write, and run it via `cz`, then let yourself be guided thought the steps.\
This tool must be ran outside of the `Dev Container`, otherwise you will get an error stating that `cz` is not a know command.
