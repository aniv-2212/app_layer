import type { ReactNode } from 'react'
import { ArrowLeftRight, Braces, Calculator, ShieldHalf } from 'lucide-react'

type FeatureGroup = {
  title: string
  icon: ReactNode
  accent: string
  features: Array<{ key: string; label: string }>
}

const GROUPS: FeatureGroup[] = [
  {
    title: 'Structural Dimensions',
    icon: <ArrowLeftRight className="h-4 w-4" />,
    accent: 'text-cyan-300',
    features: [
      { key: 'url_length', label: 'URL Total Length' },
      { key: 'hostname_length', label: 'Hostname Length' },
      { key: 'domain_length', label: 'Domain Length' },
      { key: 'path_length', label: 'Path Length' },
      { key: 'query_length', label: 'Query Length' },
      { key: 'fragment_length', label: 'Fragment Length' },
      { key: 'tld_length', label: 'TLD Length' },
    ],
  },
  {
    title: 'Tokenization & Complexity',
    icon: <Braces className="h-4 w-4" />,
    accent: 'text-fuchsia-300',
    features: [
      { key: 'entropy', label: 'Entropy Rate' },
      { key: 'token_count', label: 'Token Count' },
      { key: 'avg_token_length', label: 'Avg Token Length' },
      { key: 'max_token_length', label: 'Max Token Length' },
      { key: 'longest_token', label: 'Longest Token' },
      { key: 'empty_tokens', label: 'Empty Tokens' },
    ],
  },
  {
    title: 'Character Ratios',
    icon: <Calculator className="h-4 w-4" />,
    accent: 'text-amber-300',
    features: [
      { key: 'dot_count', label: 'Dots (.)' },
      { key: 'hyphen_count', label: 'Hyphens (-)' },
      { key: 'underscore_count', label: 'Underscores (_)' },
      { key: 'slash_count', label: 'Slashes (/)' },
      { key: 'special_char_count', label: 'Special Chars' },
      { key: 'digit_count', label: 'Digit Count' },
      { key: 'letter_count', label: 'Letter Count' },
      { key: 'digit_ratio', label: 'Digit Ratio' },
      { key: 'letter_ratio', label: 'Letter Ratio' },
      { key: 'uppercase_count', label: 'Uppercase Count' },
      { key: 'max_consecutive_digits', label: 'Max Consecutive Digits' },
      { key: 'consecutive_special_groups', label: 'Special Groups' },
    ],
  },
  {
    title: 'Threat Signatures',
    icon: <ShieldHalf className="h-4 w-4" />,
    accent: 'text-rose-300',
    features: [
      { key: 'https', label: 'HTTPS Protocol' },
      { key: 'http', label: 'HTTP Plaintext' },
      { key: 'ip_address', label: 'IP Hostname' },
      { key: 'subdomain_count', label: 'Subdomain Count' },
      { key: 'suspicious_keyword_count', label: 'Suspicious Keywords' },
      { key: 'brand_keyword_count', label: 'Brand Spoof Keywords' },
      { key: 'url_shortener', label: 'URL Shortener' },
      { key: 'suspicious_tld', label: 'Suspicious TLD' },
      { key: 'double_slash_count', label: 'Double Slashes (//)' },
      { key: 'has_at_symbol', label: 'Has @ Symbol' },
      { key: 'equal_count', label: 'Equal Signs (=)' },
      { key: 'question_count', label: 'Question Marks (?)' },
      { key: 'ampersand_count', label: 'Ampersands (&)' },
      { key: 'percent_count', label: 'Percents (%)' },
      { key: 'has_port', label: 'Custom Port' },
      { key: 'domain_has_digits', label: 'Domain Has Digits' },
    ],
  },
]

function formatValue(value: number | undefined): string {
  if (value === undefined) return '—'
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(2)
}

type FeatureGridProps = {
  features: Record<string, number>
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="space-y-5">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <div className={`mb-3 flex items-center gap-2 ${group.accent}`}>
            {group.icon}
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">{group.title}</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {group.features.map((feature) => (
              <div key={feature.key} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">
                <p className="text-xs text-slate-400">{feature.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{formatValue(features[feature.key])}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
