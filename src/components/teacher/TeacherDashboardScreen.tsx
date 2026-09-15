import React, { useState, useEffect, useMemo } from 'react';
import { 
  StudentData, 
  TeacherDashboardTab, 
  AssessmentRubric,
  TeacherAlert,
  TeacherInsightItem
} from '../../types';
import { 
  getStoredStudents, 
  getStoredTeacherConfig, 
  saveStoredTeacherConfig, 
  computeTeacherAlerts, 
  computeTeacherInsights,
  assignInterventionToStudent,
  computeClassRooms
} from '../../utils/teacherStorage';
import { TeacherHeader } from './TeacherHeader';
import { TeacherSidebar } from './TeacherSidebar';
import { TeacherOverviewView } from './TeacherOverviewView';
import { StudentListView } from './StudentListView';
import { StudentProfileModal } from './StudentProfileModal';
import { ClassComparisonView } from './ClassComparisonView';
import { AssessmentEngineView } from './AssessmentEngineView';
import { MasteryDomainView } from './MasteryDomainView';
import { AnalyticsView } from './AnalyticsView';
import { RemedialDashboardView } from './RemedialDashboardView';
import { EnrichmentDashboardView } from './EnrichmentDashboardView';
import { QuestionBankView } from './QuestionBankView';
import { TeacherSettingsView } from './TeacherSettingsView';
import { isTeacherAuthenticated } from '../../utils/teacherAuth';
import { Bell, X, AlertTriangle, ChevronRight } from 'lucide-react';

interface TeacherDashboardScreenProps {
  onSwitchToStudentMode: () => void;
  onLogoutTeacher?: () => void;
}

export const TeacherDashboardScreen: React.FC<TeacherDashboardScreenProps> = ({
  onSwitchToStudentMode,
  onLogoutTeacher,
}) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [activeTab, setActiveTab] = useState<TeacherDashboardTab>('dashboard');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [rubric, setRubric] = useState<AssessmentRubric>(getStoredTeacherConfig().rubric);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security check: verify authentication
  useEffect(() => {
    if (!isTeacherAuthenticated()) {
      if (onLogoutTeacher) {
        onLogoutTeacher();
      } else {
        onSwitchToStudentMode();
      }
    }
  }, [onLogoutTeacher, onSwitchToStudentMode]);

  // Initialize and load data from local storage
  const reloadData = () => {
    const loadedStudents = getStoredStudents();
    setStudents(loadedStudents);
    const config = getStoredTeacherConfig();
    setSelectedClass(config.selectedClass || 'ALL');
    setRubric(config.rubric);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Compute Alerts & Insights
  const alerts = useMemo(() => computeTeacherAlerts(students, selectedClass), [students, selectedClass]);
  const insights = useMemo(() => computeTeacherInsights(students, selectedClass), [students, selectedClass]);

  // Counts for Badges
  const remedialCount = useMemo(
    () => students.filter((s) => (selectedClass === 'ALL' || s.className === selectedClass) && s.mastery > 0 && s.mastery < 60).length,
    [students, selectedClass]
  );

  const enrichmentCount = useMemo(
    () => students.filter((s) => (selectedClass === 'ALL' || s.className === selectedClass) && s.mastery >= 80).length,
    [students, selectedClass]
  );

  // Handlers
  const handleSelectClass = (className: string) => {
    setSelectedClass(className);
    saveStoredTeacherConfig({ selectedClass: className, rubric });
  };

  const handleUpdateRubric = (newRubric: AssessmentRubric) => {
    setRubric(newRubric);
    saveStoredTeacherConfig({ selectedClass, rubric: newRubric });
  };

  const handleAssignRemedial = (studentId: string, topicId: string, title: string, notes: string) => {
    const updated = assignInterventionToStudent(students, studentId, 'remedial', topicId, title, notes);
    setStudents(updated);
  };

  const handleAssignEnrichment = (studentId: string, topicId: string, title: string, notes: string) => {
    const updated = assignInterventionToStudent(students, studentId, 'enrichment', topicId, title, notes);
    setStudents(updated);
  };

  const activeStudentProfile = useMemo(
    () => (selectedStudentId ? students.find((s) => s.id === selectedStudentId) || null : null),
    [selectedStudentId, students]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <TeacherHeader
        selectedClass={selectedClass}
        onSelectClass={handleSelectClass}
        totalStudents={students.length}
        activeStudents={students.filter((s) => s.lastActiveDaysAgo <= 3).length}
        alertCount={alerts.length}
        onSwitchToStudentMode={onSwitchToStudentMode}
        onLogoutTeacher={onLogoutTeacher}
        onOpenAlerts={() => setAlertsModalOpen(true)}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <TeacherSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          remedialCount={remedialCount}
          enrichmentCount={enrichmentCount}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onLogoutTeacher={onLogoutTeacher}
        />

        {/* Dynamic Tab Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <TeacherOverviewView
              students={students}
              selectedClass={selectedClass}
              alerts={alerts}
              insights={insights}
              onNavigateTab={setActiveTab}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'students' && (
            <StudentListView
              students={students}
              selectedClass={selectedClass}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'classes' && (
            <ClassComparisonView
              students={students}
              selectedClass={selectedClass}
              onSelectClass={handleSelectClass}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'assessment' && (
            <AssessmentEngineView
              students={students}
              selectedClass={selectedClass}
            />
          )}

          {activeTab === 'mastery' && (
            <MasteryDomainView
              students={students}
              selectedClass={selectedClass}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              students={students}
              selectedClass={selectedClass}
            />
          )}

          {activeTab === 'remedial' && (
            <RemedialDashboardView
              students={students}
              selectedClass={selectedClass}
              onAssignRemedial={handleAssignRemedial}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'enrichment' && (
            <EnrichmentDashboardView
              students={students}
              selectedClass={selectedClass}
              onAssignEnrichment={handleAssignEnrichment}
              onSelectStudent={setSelectedStudentId}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionBankView />
          )}

          {activeTab === 'settings' && (
            <TeacherSettingsView
              students={students}
              rubric={rubric}
              onUpdateRubric={handleUpdateRubric}
              onRefreshStudents={reloadData}
            />
          )}
        </main>
      </div>

      {/* Student Dossier Modal */}
      {activeStudentProfile && (
        <StudentProfileModal
          student={activeStudentProfile}
          onClose={() => setSelectedStudentId(null)}
          onAssignRemedial={handleAssignRemedial}
          onAssignEnrichment={handleAssignEnrichment}
        />
      )}

      {/* Alerts Drawer / Modal */}
      {alertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase">
                  Pusat Peringatan & Perhatian Guru
                </h3>
              </div>
              <button
                onClick={() => setAlertsModalOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Tidak ada anomali atau peringatan yang memerlukan tindakan segera.
                </p>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setAlertsModalOpen(false);
                      if (a.type === 'remedial') setActiveTab('remedial');
                      else setActiveTab('students');
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer flex items-start justify-between gap-3 group transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                        {a.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {a.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 mt-1" />
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setAlertsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
