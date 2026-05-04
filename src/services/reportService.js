const STORAGE_KEY = "foundu_reports";

export const saveReport = (report) => {
  const existingReports = getReports();
  const newReport = {
    ...report,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: "pending"
  };
  const updatedReports = [newReport, ...existingReports];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
  return newReport;
};

export const getReports = () => {
  const reports = localStorage.getItem(STORAGE_KEY);
  return reports ? JSON.parse(reports) : [];
};

export const updateReportStatus = (id, newStatus) => {
  const reports = getReports();
  const updatedReports = reports.map(report =>
    report.id === id ? { ...report, status: newStatus } : report
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
};

export const deleteReport = (id) => {
  const reports = getReports();
  const updatedReports = reports.filter(report => report.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
};