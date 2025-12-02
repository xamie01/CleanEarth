import { supabase, UserType } from './supabase';

export async function signUp(email: string, password: string, userType: UserType, profileData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('User creation failed');

  if (userType === 'user') {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
      });

    if (profileError) throw profileError;
  } else {
    const { error: profileError } = await supabase
      .from('collector_profiles')
      .insert({
        id: data.user.id,
        business_name: profileData.businessName,
        owner_name: profileData.ownerName,
        registration_number: profileData.registrationNumber,
        phone: profileData.phone,
        email: email,
        service_areas: profileData.serviceAreas || [],
        bank_account_name: profileData.bankAccountName,
        bank_account_number: profileData.bankAccountNumber,
        bank_name: profileData.bankName,
        verification_status: 'pending',
      });

    if (profileError) throw profileError;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserType(userId: string): Promise<UserType> {
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (userProfile) return 'user';

  const { data: collectorProfile } = await supabase
    .from('collector_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (collectorProfile) return 'collector';

  throw new Error('User type not found');
}
