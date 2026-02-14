import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const dimensions = [
  { id: 'stepCount', name: 'Step Count', weight: 0.15, icon: 'list', description: 'Number of distinct steps required' },
  { id: 'timeRequired', name: 'Time Required', weight: 0.20, icon: 'time', description: 'Total time from start to completion' },
  { id: 'documentBurden', name: 'Document Burden', weight: 0.15, icon: 'document', description: 'Number and complexity of documents' },
  { id: 'agencyTouchpoints', name: 'Agency Touchpoints', weight: 0.10, icon: 'business', description: 'Different offices/agencies involved' },
  { id: 'cost', name: 'Cost', weight: 0.15, icon: 'cash', description: 'Total fees and expenses' },
  { id: 'languageComplexity', name: 'Language Complexity', weight: 0.10, icon: 'text', description: 'Readability of instructions' },
  { id: 'errorRisk', name: 'Error Risk', weight: 0.10, icon: 'warning', description: 'Likelihood of mistakes/rejections' },
  { id: 'accessibility', name: 'Accessibility', weight: 0.05, icon: 'accessibility', description: 'Digital and physical access barriers' },
];

const benchmarks = [
  { name: "Driver's License Renewal", score: 3.2 },
  { name: 'Small Business License', score: 5.8 },
  { name: 'Building Permit', score: 6.4 },
  { name: 'Medicaid Application', score: 7.1 },
];

export default function CalculatorScreen() {
  const [processName, setProcessName] = useState('');
  const [scores, setScores] = useState({});
  const [showHelp, setShowHelp] = useState(null);

  const updateScore = (id, value) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const { weightedScore, completeness } = useMemo(() => {
    let total = 0;
    let weight = 0;
    
    dimensions.forEach(dim => {
      if (scores[dim.id] !== undefined) {
        total += scores[dim.id] * dim.weight;
        weight += dim.weight;
      }
    });
    
    const scored = Object.keys(scores).length;
    return {
      weightedScore: weight > 0 ? (total / weight).toFixed(1) : '—',
      completeness: Math.round((scored / dimensions.length) * 100),
    };
  }, [scores]);

  const getScoreColor = (score) => {
    if (score <= 3) return '#22c55e';
    if (score <= 5) return '#eab308';
    if (score <= 7) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score === '—') return 'Not Scored';
    const num = parseFloat(score);
    if (num <= 3) return 'Low Complexity';
    if (num <= 5) return 'Moderate';
    if (num <= 7) return 'High Complexity';
    return 'Very High';
  };

  const resetScores = () => {
    Alert.alert(
      'Reset Calculator',
      'Clear all scores and start over?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          setScores({});
          setProcessName('');
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complexity Calculator</Text>
        <Text style={styles.headerSubtitle}>
          Measure any government process using the CLEAR 8-dimension methodology
        </Text>
      </View>

      {/* Process Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Process Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Business License Application"
          placeholderTextColor="#64748b"
          value={processName}
          onChangeText={setProcessName}
        />
      </View>

      {/* Score Display */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Complexity Index</Text>
        <Text style={[styles.scoreValue, { color: getScoreColor(weightedScore) }]}>
          {weightedScore}
        </Text>
        <Text style={[styles.scoreStatus, { color: getScoreColor(weightedScore) }]}>
          {getScoreLabel(weightedScore)}
        </Text>
        <View style={styles.completenessBar}>
          <View style={styles.completenessBarBg}>
            <View style={[styles.completenessBarFill, { width: `${completeness}%` }]} />
          </View>
          <Text style={styles.completenessText}>{completeness}% scored</Text>
        </View>
      </View>

      {/* Dimensions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Score Each Dimension (1-10)</Text>
        
        {dimensions.map((dim) => (
          <View key={dim.id} style={styles.dimensionCard}>
            <View style={styles.dimensionHeader}>
              <View style={styles.dimensionInfo}>
                <Ionicons name={dim.icon} size={20} color="#3b82f6" />
                <View style={styles.dimensionText}>
                  <Text style={styles.dimensionName}>{dim.name}</Text>
                  <Text style={styles.dimensionWeight}>Weight: {(dim.weight * 100).toFixed(0)}%</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowHelp(showHelp === dim.id ? null : dim.id)}>
                <Ionicons name="help-circle" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            {showHelp === dim.id && (
              <Text style={styles.helpText}>{dim.description}</Text>
            )}
            
            <View style={styles.scoreButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.scoreButton,
                    scores[dim.id] === value && styles.scoreButtonActive,
                    scores[dim.id] === value && { backgroundColor: getScoreColor(value) + '30', borderColor: getScoreColor(value) }
                  ]}
                  onPress={() => updateScore(dim.id, value)}
                >
                  <Text style={[
                    styles.scoreButtonText,
                    scores[dim.id] === value && { color: getScoreColor(value) }
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Benchmarks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comparison Benchmarks</Text>
        <View style={styles.benchmarkList}>
          {benchmarks.map((benchmark, index) => (
            <View key={index} style={styles.benchmarkItem}>
              <Text style={styles.benchmarkName}>{benchmark.name}</Text>
              <View style={styles.benchmarkScore}>
                <View style={[styles.benchmarkDot, { backgroundColor: getScoreColor(benchmark.score) }]} />
                <Text style={styles.benchmarkValue}>{benchmark.score}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetScores}>
        <Ionicons name="refresh" size={18} color="#f87171" />
        <Text style={styles.resetText}>Reset Calculator</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  textInput: {
    padding: 14,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#e2e8f0',
    fontSize: 15,
  },
  scoreCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  scoreStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  completenessBar: {
    width: '100%',
    marginTop: 20,
  },
  completenessBarBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completenessBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  completenessText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  dimensionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dimensionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dimensionText: {
    flex: 1,
  },
  dimensionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  dimensionWeight: {
    fontSize: 12,
    color: '#64748b',
  },
  helpText: {
    fontSize: 13,
    color: '#94a3b8',
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  scoreButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scoreButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreButtonActive: {
    borderWidth: 2,
  },
  scoreButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  benchmarkList: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  benchmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  benchmarkName: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  benchmarkScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benchmarkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  benchmarkValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    padding: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f87171',
  },
  spacer: {
    height: 40,
  },
});
