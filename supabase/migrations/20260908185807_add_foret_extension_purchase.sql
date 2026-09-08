/* Allow the "À la forêt" extension to be purchased via record_extension_purchase */
CREATE OR REPLACE FUNCTION public.record_extension_purchase(
  p_item_id text,
  p_provider_order_id text DEFAULT NULL
)
RETURNS public.purchases
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.purchases;
  v_amount numeric(10,2);
  v_currency text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_item_id = 'intense-speed-extension' THEN
    v_amount := 5.00;
    v_currency := 'CHF';
  ELSIF p_item_id = 'foret-extension' THEN
    v_amount := 5.00;
    v_currency := 'CHF';
  ELSE
    RAISE EXCEPTION 'Unknown extension';
  END IF;

  INSERT INTO public.purchases (user_id, item_id, item_type, amount, currency, provider_order_id, status)
  VALUES (auth.uid(), p_item_id, 'extension', v_amount, v_currency, p_provider_order_id, 'completed')
  RETURNING * INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.record_extension_purchase(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_extension_purchase(text, text) TO authenticated;
