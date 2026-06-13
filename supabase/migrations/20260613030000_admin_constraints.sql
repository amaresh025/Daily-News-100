-- Enforce 1-2 admin limit
CREATE OR REPLACE FUNCTION public.check_admin_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
BEGIN
  IF NEW.role = 'admin' THEN
    SELECT COUNT(*) INTO admin_count
    FROM public.user_roles
    WHERE role = 'admin';
    
    IF admin_count >= 2 THEN
      RAISE EXCEPTION 'Maximum of 2 admin accounts allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_admin_limit ON public.user_roles;
CREATE TRIGGER enforce_admin_limit
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.check_admin_limit();

-- Function to safely promote user to admin (checks limit first)
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  IF admin_count >= 2 THEN
    RAISE EXCEPTION 'Maximum of 2 admin accounts allowed';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Function to demote admin (only if > 1 admin exists)
CREATE OR REPLACE FUNCTION public.demote_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  IF admin_count <= 1 THEN
    RAISE EXCEPTION 'Cannot demote: at least 1 admin required';
  END IF;
  
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'admin';
  
  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.promote_to_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.demote_admin(uuid) TO authenticated;