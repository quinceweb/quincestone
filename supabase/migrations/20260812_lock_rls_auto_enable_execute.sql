REVOKE ALL PRIVILEGES ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE ALL PRIVILEGES ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE ALL PRIVILEGES ON FUNCTION public.rls_auto_enable() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO postgres;
