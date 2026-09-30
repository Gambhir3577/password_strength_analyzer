import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Code2,
  Lock,
} from 'lucide-react';
import type { PasswordAnalysisResult } from '../../types/analyzer';
import type { ComplianceStandardResult } from '../../types/compliance';
import {
  generateAuditJson,
  generateAuditMarkdown,
  downloadFile,
} from '../../services/auditExportService';
import { Badge } from '../common/Badge';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PasswordAnalysisResult;
  compliance: ComplianceStandardResult;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  compliance,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'markdown' | 'json'>('overview');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const markdownContent = generateAuditMarkdown(analysis, compliance);
  const jsonReport = generateAuditJson(analysis, compliance);
  const jsonString = JSON.stringify(jsonReport, null, 2);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadJson = () => {
    downloadFile(
      jsonString,
      `cipherguard-audit-${jsonReport.reportId.toLowerCase()}.json`,
      'application/json'
    );
  };

  const handleDownloadMarkdown = () => {
    downloadFile(
      markdownContent,
      `cipherguard-audit-${jsonReport.reportId.toLowerCase()}.md`,
      'text/markdown'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="modal-title" className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Cryptographic Security & Compliance Audit
                </h3>
                <Badge variant="cyan" size="sm">
                  Sanitized
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Report ID: <span className="font-mono">{jsonReport.reportId}</span> • 100% Client-Side
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'markdown'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Markdown Report
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              JSON Schema
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 pb-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto max-h-[55vh] space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Scorecard Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">
                    Strength Score
                  </span>
                  <div className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                    {analysis.score} / 4
                  </div>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {analysis.level}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">
                    Shannon Entropy
                  </span>
                  <div className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                    {analysis.entropyBits} bits
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Pool: {analysis.variety.poolSize} chars
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">
                    Compliance ({compliance.name})
                  </span>
                  <div className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                    {compliance.scorePercentage}%
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      compliance.isCompliant ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {compliance.isCompliant ? 'Compliant' : 'Non-Compliant'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">
                    Vulnerabilities
                  </span>
                  <div className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                    {analysis.patterns.length}
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Patterns Flagged
                  </span>
                </div>
              </div>

              {/* Threat resistance summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Threat Resistance Timeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {analysis.crackTimes.map((ct) => (
                    <div
                      key={ct.scenario}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {ct.label}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {ct.guessesPerSecond.toLocaleString()} / sec
                        </div>
                      </div>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {ct.displayTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Disclaimer */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>Privacy Verified:</strong> Plaintext secret is never included in exported audits. Only length, character sets, entropy math, and vulnerability IDs are saved.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'markdown' && (
            <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
              {markdownContent}
            </pre>
          )}

          {activeTab === 'json' && (
            <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
              {jsonString}
            </pre>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleCopy(activeTab === 'json' ? jsonString : markdownContent)
              }
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : `Copy ${activeTab === 'json' ? 'JSON' : 'Markdown'}`}
            </button>

            {activeTab === 'json' ? (
              <button
                onClick={handleDownloadJson}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download .json
              </button>
            ) : (
              <button
                onClick={handleDownloadMarkdown}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download .md
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
