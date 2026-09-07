# Quincestone Admin Control Plane

P18 establishes the separate internal platform-administration application.

## Boundary

The control plane governs Quincestone itself. It is not the customer operating application, and `workspace_members.role = owner/admin/member` does not grant platform administration.

The current shell is intentionally **fail-closed**: privileged tenant data and actions are not exposed until an independent platform administrator authority is provisioned and verified server-side.

See `docs/18_ADMIN_CONTROL_PLANE.md` for the authority contract and release gate.
