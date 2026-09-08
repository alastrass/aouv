/* Restrict public access to private account and purchase objects. */
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.purchases FROM anon;
REVOKE ALL ON public.profiles FROM PUBLIC;
REVOKE ALL ON public.purchases FROM PUBLIC;
GRANT SELECT, INSERT, DELETE ON public.profiles TO authenticated;
GRANT SELECT, DELETE ON public.purchases TO authenticated;
GRANT UPDATE (email) ON public.profiles TO authenticated;
GRANT INSERT (item_id, item_type, amount, currency, provider_order_id, status) ON public.purchases TO authenticated;

REVOKE ALL ON FUNCTION public.create_profile_for_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.create_profile_for_new_user() FROM authenticated;
REVOKE ALL ON FUNCTION public.create_profile_for_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_extension_purchase(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.record_extension_purchase(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_extension_purchase(text, text) TO authenticated;
