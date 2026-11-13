DROP POLICY "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Completed profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR onboarded = true);