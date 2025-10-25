-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'player');

-- Create enum for booking status  
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for thread interest status
CREATE TYPE public.interest_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create enum for slot status
CREATE TYPE public.slot_status AS ENUM ('available', 'booked');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create arenas table
CREATE TABLE public.arenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  sports_type TEXT NOT NULL,
  contact_info TEXT,
  description TEXT,
  image_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arena_id UUID NOT NULL REFERENCES public.arenas(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  status slot_status DEFAULT 'available',
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create index for slot lookup
CREATE INDEX idx_slots_arena_date ON public.slots(arena_id, date);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create threads table
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sport TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  arena_id UUID REFERENCES public.arenas(id) ON DELETE SET NULL,
  max_players INTEGER DEFAULT 10,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create thread_interests table
CREATE TABLE public.thread_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status interest_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User roles RLS policies  
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Arenas RLS policies
CREATE POLICY "Anyone can view approved arenas"
  ON public.arenas FOR SELECT
  TO authenticated
  USING (approved = true OR manager_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can create arenas"
  ON public.arenas FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'manager') AND manager_id = auth.uid());

CREATE POLICY "Managers can update own arenas"
  ON public.arenas FOR UPDATE
  TO authenticated
  USING (manager_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete arenas"
  ON public.arenas FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Slots RLS policies
CREATE POLICY "Anyone can view slots for approved arenas"
  ON public.slots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.arenas
      WHERE arenas.id = slots.arena_id
        AND (arenas.approved = true OR arenas.manager_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Managers can manage slots for own arenas"
  ON public.slots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.arenas
      WHERE arenas.id = slots.arena_id
        AND arenas.manager_id = auth.uid()
    )
  );

-- Bookings RLS policies
CREATE POLICY "Players can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    player_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.slots
      JOIN public.arenas ON arenas.id = slots.arena_id
      WHERE slots.id = bookings.slot_id
        AND arenas.manager_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Players can create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'player') AND player_id = auth.uid());

CREATE POLICY "Players can cancel own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (player_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Threads RLS policies
CREATE POLICY "Anyone can view non-blocked threads"
  ON public.threads FOR SELECT
  TO authenticated
  USING (blocked = false OR creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Players can create threads"
  ON public.threads FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'player') AND creator_id = auth.uid());

CREATE POLICY "Creators and admins can update threads"
  ON public.threads FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Thread interests RLS policies
CREATE POLICY "Users can view interests for threads they're part of"
  ON public.thread_interests FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.threads
      WHERE threads.id = thread_interests.thread_id
        AND threads.creator_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Players can express interest"
  ON public.thread_interests FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'player') AND user_id = auth.uid());

CREATE POLICY "Thread creators can update interests"
  ON public.thread_interests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.threads
      WHERE threads.id = thread_interests.thread_id
        AND threads.creator_id = auth.uid()
    )
  );

-- Messages RLS policies
CREATE POLICY "Users can view messages they're part of"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    receiver_id = auth.uid() OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can send messages to accepted thread participants"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.thread_interests
      WHERE thread_interests.thread_id = messages.thread_id
        AND thread_interests.user_id = receiver_id
        AND thread_interests.status = 'accepted'
    )
  );

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_arenas_updated_at
  BEFORE UPDATE ON public.arenas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_slots_updated_at
  BEFORE UPDATE ON public.slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_threads_updated_at
  BEFORE UPDATE ON public.threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  
  -- Assign default player role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'player');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();