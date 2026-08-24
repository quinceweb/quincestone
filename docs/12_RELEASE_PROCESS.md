# Quincestone — Release Process

## Source authority

`main` is the production source authority. Substantive changes use focused branches and pull requests.

## Release states

A change may be:

1. Implemented — source code exists.
2. Configured — provider/project configuration exists.
3. Deployed — a provider reports the deployment/version.
4. Verified — the deployed behavior has been directly checked.
5. Live — production domain/runtime verification confirms the intended behavior.

These states must never be conflated.

## Required gate

For a production-facing change:

- inspect the diff;
- run the repository quality gate;
- verify database/security changes when applicable;
- obtain a successful Vercel deployment for the exact release commit when applicable;
- verify the preview/runtime behavior;
- merge the PR;
- verify the resulting `main` deployment;
- verify the production domain separately.

A previous successful deployment of an earlier commit does not verify a later commit.

## Safety

Never bypass a failed deployment check by claiming source existence is deployment success. Never create synthetic production records to prove a workflow. Never perform live financial or irreversible external actions during verification unless explicitly authorized.
