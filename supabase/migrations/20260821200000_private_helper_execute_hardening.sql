revoke execute on function private.is_workspace_member(uuid) from public, anon;
revoke execute on function private.is_workspace_admin(uuid) from public, anon;
revoke execute on function private.has_workspace_for_user(uuid) from public, anon;
revoke execute on function private.create_owner_membership() from public, anon;
