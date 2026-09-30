import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Settings2,
  Shield,
} from 'lucide-react';
import type { PasswordAnalysisResult } from '../../types/analyzer';
import type {
  ComplianceStandardId,
  ComplianceStandardResult,
  CustomPolicyConfig,
} from '../../types/compliance';
import {
  evaluateAllCompliance,
  DEFAULT_CUSTOM_POLICY,
} from '../../engine/compliance';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ComplianceChecklistProps {
  analysis: PasswordAnalysisResult;
  onApplyFix?: (newPassword: string) => void;
}

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  analysis,
}) => {
  const [selectedStandard, setSelectedStandard] =
    useState<ComplianceStandardId>('nist_800_63b');
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  const [customConfig, setCustomConfig] =
    useState<CustomPolicyConfig>(DEFAULT_CUSTOM_POLICY);
  const [showCustomSettings, setShowCustomSettings] = useState<boolean>(false);

  const complianceResults = evaluateAllCompliance(analysis, customConfig);
  const activeResult: ComplianceStandardResult = complianceResults[selectedStandard];

  const toggleRuleExpand = (ruleId: string) => {
    setExpandedRules((prev) => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const standardsList: { id: ComplianceStandardId; label: string; badge: string }[] = [
    { id: 'nist_800_63b', label: 'NIST 800-63B', badge: 'Federal' },
    { id: 'pci_dss_v4', label: 'PCI-DSS v4.0', badge: 'Finance' },
    { id: 'cis_enterprise', label: 'CIS Enterprise', badge: 'Strict' },
    { id: 'owasp_asvs', label: 'OWASP ASVS', badge: 'AppSec' },
    { id: 'custom', label: 'Custom Policy', badge: 'Custom' },
  ];

  return (
    <Card className="space-y-5">
      {/* Header & Standard Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Compliance & Security Policy Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validate against international enterprise identity & cryptographic standards
            </p>
          </div>
        </div>

        {/* Standards Navigation Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {standardsList.map((std) => {
            const isSelected = selectedStandard === std.id;
            const res = complianceResults[std.id];
            return (
              <button
                key={std.id}
                onClick={() => setSelectedStandard(std.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{std.label}</span>
                {res.isCompliant ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Standard Summary Card */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {activeResult.name} ({activeResult.version})
            </span>
            <Badge
              variant={activeResult.isCompliant ? 'success' : 'danger'}
              size="sm"
            >
              {activeResult.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeResult.organization} • {activeResult.summary}
          </p>
        </div>

        {/* Progress Gauge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {activeResult.passedCount} / {activeResult.totalCount} Passed
            </div>
            <div className="text-[11px] text-slate-400">
              {activeResult.scorePercentage}% Compliance
            </div>
          </div>
          <div className="w-24 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                activeResult.isCompliant
                  ? 'bg-emerald-500'
                  : activeResult.scorePercentage >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${activeResult.scorePercentage}%` }}
            />
          </div>

          {selectedStandard === 'custom' && (
            <button
              onClick={() => setShowCustomSettings(!showCustomSettings)}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Configure Policy"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Custom Policy Config Drawer */}
      {selectedStandard === 'custom' && showCustomSettings && (
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Settings2 className="w-4 h-4" />
            Custom Enterprise Policy Configuration
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                Minimum Length: {customConfig.minLength} chars
              </label>
              <input
                type="range"
                min="6"
                max="32"
                value={customConfig.minLength}
                onChange={(e) =>
                  setCustomConfig({ ...customConfig, minLength: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                Min Entropy: {customConfig.minEntropyBits} bits
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={customConfig.minEntropyBits}
                onChange={(e) =>
                  setCustomConfig({ ...customConfig, minEntropyBits: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={customConfig.requireUppercase}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, requireUppercase: e.target.checked })
                  }
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Require Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={customConfig.requireSymbols}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, requireSymbols: e.target.checked })
                  }
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Require Symbols (!@#$)
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={customConfig.disallowSequences}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, disallowSequences: e.target.checked })
                  }
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Disallow Sequences / Walks
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={customConfig.disallowCommonWords}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, disallowCommonWords: e.target.checked })
                  }
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Disallow Leaked Wordlists
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Rules Criteria List */}
      <div className="space-y-2.5">
        {activeResult.rules.map((rule) => {
          const isExpanded = !!expandedRules[rule.id];
          return (
            <div
              key={rule.id}
              className={`rounded-xl border transition-all duration-200 ${
                rule.status === 'pass'
                  ? 'border-emerald-200/80 bg-emerald-500/5 dark:border-emerald-900/30'
                  : rule.status === 'warning'
                  ? 'border-amber-200/80 bg-amber-500/5 dark:border-amber-900/30'
                  : 'border-rose-200/80 bg-rose-500/5 dark:border-rose-900/30'
              }`}
            >
              <div
                onClick={() => toggleRuleExpand(rule.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  {rule.status === 'pass' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : rule.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {rule.name}
                    </span>
                    {rule.details && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {rule.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      rule.status === 'pass'
                        ? 'success'
                        : rule.status === 'warning'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {rule.status.toUpperCase()}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Standard Requirement:{' '}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {rule.description}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Cryptographic Rationale:{' '}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {rule.rationale}
                    </span>
                  </div>
                  {rule.remediation && rule.status !== 'pass' && (
                    <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                          Recommended Remediation:{' '}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {rule.remediation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
