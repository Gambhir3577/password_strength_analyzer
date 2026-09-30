import React, { useMemo, useState, useEffect } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import type { UserContext } from '../../types/analyzer';
import { analyzePassword } from '../../engine/scoring';
import { evaluateNist80063B } from '../../engine/compliance';
import { useHibpBreachCheck } from '../../hooks/useHibpBreachCheck';
import { soundEngine } from '../../services/audioService';
import { PasswordInput } from './PasswordInput';
import { StrengthMeter } from './StrengthMeter';
import { EntropyCard } from './EntropyCard';
import { CrackTimeCard } from './CrackTimeCard';
import { CharacterBreakdown } from './CharacterBreakdown';
import { PatternBreakdown } from './PatternBreakdown';
import { ActionableFeedback } from './ActionableFeedback';
import { UserContextInput } from './UserContextInput';
import { QuickFixToolbar } from './QuickFixToolbar';
import { ComplianceChecklist } from './ComplianceChecklist';
import { AuditReportModal } from './AuditReportModal';
import { HibpBreachBadge } from '../privacy/HibpBreachBadge';
import { Card } from '../common/Card';

interface AnalyzerViewProps {
  password: string;
  setPassword: (val: string) => void;
  userContext: UserContext;
  setUserContext: (ctx: UserContext) => void;
  onNavigateToGenerator: () => void;
  onNavigateToPrivacy: () => void;
  isAuditModalOpen?: boolean;
  setIsAuditModalOpen?: (open: boolean) => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  password,
  setPassword,
  userContext,
  setUserContext,
  onNavigateToGenerator,
  onNavigateToPrivacy,
  isAuditModalOpen: controlledAuditOpen,
  setIsAuditModalOpen: controlledSetAuditOpen,
}) => {
  const [internalAuditOpen, setInternalAuditOpen] = useState<boolean>(false);
  const isAuditOpen = controlledAuditOpen ?? internalAuditOpen;
  const setAuditOpen = controlledSetAuditOpen ?? setInternalAuditOpen;

  const analysis = useMemo(() => {
    return analyzePassword(password, userContext);
  }, [password, userContext]);

  const nistCompliance = useMemo(() => {
    return evaluateNist80063B(analysis);
  }, [analysis]);

  // Play audio milestone feedback when score changes
  useEffect(() => {
    if (password.length > 0) {
      soundEngine.playScoreMilestone(analysis.score);
    }
  }, [analysis.score, password.length]);

  const { isEnabled: isHibpEnabled, setIsEnabled: setIsHibpEnabled, result: hibpResult } =
    useHibpBreachCheck(password);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Primary Input & Strength Meter Hero Card */}
      <Card
        glow={
          password.length === 0
            ? 'none'
            : analysis.score === 0
            ? 'weak'
            : analysis.score === 1
            ? 'fair'
            : analysis.score === 2
            ? 'fair'
            : analysis.score === 3
            ? 'strong'
            : 'cyan'
        }
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cryptographic Threat Evaluation
            </span>
          </div>

          <button
            onClick={() => setAuditOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Export Audit Report
          </button>
        </div>

        <PasswordInput
          value={password}
          onChange={setPassword}
          onGenerateClick={onNavigateToGenerator}
          autoFocus={true}
        />

        <StrengthMeter
          score={analysis.score}
          level={analysis.level}
          passwordLength={analysis.passwordLength}
        />

        {/* Quick Fix Suggestions */}
        <QuickFixToolbar
          password={password}
          analysis={analysis}
          onApplyFix={setPassword}
        />
      </Card>

      {/* Optional HIBP Breach Check & User Context Drawer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HibpBreachBadge
          isEnabled={isHibpEnabled}
          onToggle={setIsHibpEnabled}
          result={hibpResult}
          onExplainClick={onNavigateToPrivacy}
        />

        <UserContextInput
          context={userContext}
          onChange={setUserContext}
        />
      </div>

      {/* Character Breakdown */}
      <CharacterBreakdown variety={analysis.variety} />

      {/* Metrics & Threat Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EntropyCard
          entropyBits={analysis.entropyBits}
          estimatedGuesses={analysis.estimatedGuesses}
          poolSize={analysis.variety.poolSize}
          analysisTimeMs={analysis.analysisTimeMs}
        />

        <CrackTimeCard crackTimes={analysis.crackTimes} />
      </div>

      {/* Patterns & Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PatternBreakdown patterns={analysis.patterns} />
        <ActionableFeedback feedback={analysis.feedback} />
      </div>

      {/* Compliance & Policy Engine */}
      <ComplianceChecklist
        analysis={analysis}
        onApplyFix={setPassword}
      />

      {/* Audit Report Modal */}
      <AuditReportModal
        isOpen={isAuditOpen}
        onClose={() => setAuditOpen(false)}
        analysis={analysis}
        compliance={nistCompliance}
      />
    </div>
  );
};
