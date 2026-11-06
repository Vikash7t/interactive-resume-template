import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  KeyRound,
  Info,
} from 'lucide-react';
import type { BulletEnhanceResponse, EnhancedBulletOption } from '@resucraft/shared';
import { requestBulletEnhancement } from '../../lib/api/ai-client';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

export interface BulletEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalBullet: string;
  roleTitle?: string;
  company?: string;
  onApply: (enhancedBullet: string) => void;
}

export function BulletEnhanceModal({
  isOpen,
  onClose,
  originalBullet,
  roleTitle,
  company,
  onApply,
}: BulletEnhanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BulletEnhanceResponse | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [customMetric, setCustomMetric] = useState<string>('');
  const [showByok, setShowByok] = useState<boolean>(false);
  const [byokKey, setByokKey] = useState<string>('');

  // Fetch AI enhancement on open
  useEffect(() => {
    if (isOpen && originalBullet) {
      handleEnhance();
    } else {
      setData(null);
      setSelectedIdx(0);
      setCustomMetric('');
    }
  }, [isOpen, originalBullet]);

  const handleEnhance = async () => {
    try {
      setLoading(true);
      const res = await requestBulletEnhancement({
        bullet: originalBullet,
        roleTitle,
        company,
        apiKey: byokKey.trim() || undefined,
      });
      setData(res);
      setSelectedIdx(0);
      setCustomMetric('');
    } catch (err) {
      console.error('Enhancement error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentOption: EnhancedBulletOption | undefined = data?.options[selectedIdx];

  // Live text with custom metric substituted into [X%] if provided
  const computedBulletText = currentOption
    ? customMetric.trim()
      ? currentOption.text.replace(/\[X%\]|\[N\]|\[X\]/gi, customMetric.trim())
      : currentOption.text
    : originalBullet;

  const handleApply = () => {
    onApply(computedBulletText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl border w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Modal Header */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between bg-slate-50/80"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="p-1.5 rounded-lg text-white"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                AI Bullet Enhancement Assistant
              </h3>
              <p className="text-[10.5px] text-slate-500">
                Anti-Hallucination Safe • Strict Metric Truth
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close enhancement modal"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Role Context */}
          {(roleTitle || company) && (
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Context:</span>
              <span>
                {roleTitle || 'Role'} {company ? `at ${company}` : ''}
              </span>
            </div>
          )}

          {/* Original Bullet */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Original Content:
            </span>
            <p className="text-slate-700 leading-relaxed italic">"{originalBullet}"</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500">
              <Sparkles className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs font-medium">Generating executive variations...</span>
            </div>
          )}

          {/* Alternatives List */}
          {!loading && data && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  Select High-Impact Variation:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Engine: {data.provider}
                </span>
              </div>

              <div className="space-y-2">
                {data.options.map((opt, idx) => {
                  const isSelected = selectedIdx === idx;
                  const styleLabel =
                    opt.style === 'action_impact'
                      ? 'Action & Impact'
                      : opt.style === 'technical_depth'
                        ? 'Technical Rigor'
                        : 'Concise & Direct';

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/40 shadow-xs ring-1 ring-purple-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                              isSelected
                                ? 'bg-purple-600 border-purple-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <div>
                            <p className="text-slate-900 font-medium leading-relaxed">
                              {opt.text}
                            </p>
                            <p className="text-[10.5px] text-slate-500 mt-1 italic">
                              💡 {opt.rationale}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant={opt.style === 'action_impact' ? 'primary' : 'secondary'}
                          className="text-[9.5px] shrink-0"
                        >
                          {styleLabel}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Missing Metric Interactive Replacement */}
              {currentOption?.missingMetricPrompt && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-semibold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Quantify Your Real Achievement</span>
                  </div>
                  <p className="text-[10.5px] text-amber-800 leading-snug">
                    {currentOption.missingMetricPrompt}
                  </p>
                  <div className="flex items-center space-x-2 pt-0.5">
                    <Input
                      value={customMetric}
                      onChange={(e) => setCustomMetric(e.target.value)}
                      placeholder="e.g. 45%, 3.5x, 15,000 req/sec"
                      className="text-xs bg-white h-7 py-1"
                    />
                    {customMetric && (
                      <span className="text-[10px] text-emerald-700 font-medium whitespace-nowrap">
                        ✓ Injected into preview
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Preview of Final Selection */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Preview of Selected Bullet:
                </span>
                <p className="text-slate-900 font-medium leading-relaxed">
                  • {computedBulletText}
                </p>
              </div>
            </div>
          )}

          {/* BYOK (Bring Your Own Key) Settings Accordion */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowByok(!showByok)}
              className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer font-medium"
            >
              <KeyRound className="w-3 h-3 text-slate-400" />
              <span>{showByok ? 'Hide Custom API Key' : 'Use Custom Gemini Key (BYOK)'}</span>
            </button>

            {showByok && (
              <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Gemini API Key
                  </label>
                  <span className="text-[10px] text-slate-400">Session-only (never saved)</span>
                </div>
                <Input
                  type="password"
                  value={byokKey}
                  onChange={(e) => setByokKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="text-xs bg-white"
                />
                <p className="text-[10px] text-slate-500 leading-tight">
                  Your key is used exclusively for this session in memory and will never be written to disk, database, or LocalStorage.
                </p>
              </div>
            )}
          </div>

          {/* Ethical AI Notice */}
          <div className="p-2 rounded bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 flex items-start space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Notice:</strong> ResuCraft AI refuses to invent false achievements. The original bullet is preserved until you explicitly click "Apply Selected Alternative".
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-5 py-3 border-t bg-slate-50 flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEnhance}
            disabled={loading}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Re-generate</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              disabled={loading || !data}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Selected Alternative</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
