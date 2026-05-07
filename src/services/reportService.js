import { supabase } from './supabase';

export const saveReport = async (report, userRole = 'student') => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log("1. User object:", user);
    
    if (!user.id) {
      alert("Please login first before reporting");
      return null;
    }
    
    const status = userRole === 'admin' ? 'verified' : 'pending';
    
    const reportData = {
      user_id: user.id,
      type: report.type,
      title: report.itemTitle,
      category: report.category,
      description: report.description,
      location: report.location,
      date: report.date,
      photo_url: report.photo || null,
      status: status
    };
    
    console.log("2. Report data being sent:", reportData);
    console.log("3. User role:", userRole, "Status set to:", status);
    
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select();

    console.log("4. Supabase response:", { data, error });
    
    if (error) throw error;
    
    if (userRole === 'admin') {
      alert("Report submitted and automatically verified!");
    } else {
      alert("Report submitted! Waiting for admin verification.");
    }
    return data[0];
  } catch (error) {
    console.error('Save error details:', error);
    alert("Error: " + error.message);
    return null;
  }
};

export const getReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get reports error:', error);
    return [];
  }
};

export const getPendingReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, users(name, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get pending reports error:', error);
    return [];
  }
};

export const getVerifiedReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, users(name, email)')
      .eq('status', 'verified')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get verified reports error:', error);
    return [];
  }
};

export const updateReportStatus = async (id, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Update error:', error);
    return null;
  }
};

export const deleteReport = async (id) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};