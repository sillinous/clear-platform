import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample process steps data
const processSteps = {
  'drivers-license': [
    { id: 1, title: 'Check Eligibility', description: 'Verify you qualify for renewal (not expired >2 years)', time: '5 min', type: 'research' },
    { id: 2, title: 'Gather Documents', description: 'Current license, proof of address if required', time: '10 min', type: 'document' },
    { id: 3, title: 'Choose Method', description: 'Online, mail, or in-person at DMV', time: '5 min', type: 'decision' },
    { id: 4, title: 'Complete Application', description: 'Fill out renewal form with current information', time: '15 min', type: 'form' },
    { id: 5, title: 'Pay Fee', description: 'Pay renewal fee ($25-50 depending on state)', time: '5 min', type: 'payment' },
    { id: 6, title: 'Vision Test', description: 'If in-person, complete vision screening', time: '5 min', type: 'test' },
    { id: 7, title: 'Receive License', description: 'Temporary immediately, permanent in 2-4 weeks', time: '2-4 weeks', type: 'waiting' },
  ],
  'passport': [
    { id: 1, title: 'Complete DS-11', description: 'Fill out Form DS-11 (do not sign yet)', time: '30 min', type: 'form' },
    { id: 2, title: 'Gather Citizenship Evidence', description: 'Birth certificate or naturalization certificate', time: '10 min', type: 'document' },
    { id: 3, title: 'Get Passport Photo', description: '2x2 inch photo meeting specific requirements', time: '15 min', type: 'action' },
    { id: 4, title: 'Bring ID', description: 'Driver\'s license or state ID', time: '5 min', type: 'document' },
    { id: 5, title: 'Schedule Appointment', description: 'Book at post office or acceptance facility', time: '10 min', type: 'scheduling' },
    { id: 6, title: 'Apply In-Person', description: 'Submit application and sign in front of agent', time: '30 min', type: 'in-person' },
    { id: 7, title: 'Pay Fees', description: '$130 application + $35 execution fee', time: '5 min', type: 'payment' },
    { id: 8, title: 'Wait for Processing', description: 'Standard 6-8 weeks, Expedited 2-3 weeks', time: '6-8 weeks', type: 'waiting' },
  ],
};

const defaultSteps = [
  { id: 1, title: 'Research Requirements', description: 'Check your state\'s specific requirements', time: '15 min', type: 'research' },
  { id: 2, title: 'Gather Documents', description: 'Collect all required documentation', time: '30 min', type: 'document' },
  { id: 3, title: 'Complete Application', description: 'Fill out required forms accurately', time: '30 min', type: 'form' },
  { id: 4, title: 'Submit Application', description: 'Submit online, by mail, or in person', time: 'varies', type: 'action' },
  { id: 5, title: 'Pay Fees', description: 'Pay any required processing fees', time: '5 min', type: 'payment' },
  { id: 6, title: 'Wait for Processing', description: 'Allow time for review and approval', time: 'varies', type: 'waiting' },
];

const getStepIcon = (type) => {
  switch (type) {
    case 'research': return 'search';
    case 'document': return 'document-text';
    case 'form': return 'create';
    case 'decision': return 'git-branch';
    case 'payment': return 'card';
    case 'test': return 'eye';
    case 'in-person': return 'person';
    case 'scheduling': return 'calendar';
    case 'action': return 'flash';
    case 'waiting': return 'time';
    default: return 'checkmark-circle';
  }
};

const getStepColor = (type) => {
  switch (type) {
    case 'research': return '#8b5cf6';
    case 'document': return '#06b6d4';
    case 'form': return '#3b82f6';
    case 'decision': return '#f59e0b';
    case 'payment': return '#10b981';
    case 'test': return '#ec4899';
    case 'in-person': return '#f97316';
    case 'scheduling': return '#14b8a6';
    case 'waiting': return '#64748b';
    default: return '#3b82f6';
  }
};

export default function ProcessDetailScreen({ route }) {
  const { processId, process } = route.params;
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const steps = processSteps[processId] || defaultSteps;
  
  const toggleStep = (stepId) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={[styles.headerIcon, { backgroundColor: (process?.color || '#3b82f6') + '20' }]}>
          <Ionicons name={process?.icon || 'document'} size={32} color={process?.color || '#3b82f6'} />
        </View>
        
        <View style={styles.headerMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={18} color="#64748b" />
            <Text style={styles.metaText}>{process?.time || 'Varies'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="cash" size={18} color="#64748b" />
            <Text style={styles.metaText}>{process?.cost || 'Varies'}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: process?.difficulty === 'easy' ? '#22c55e20' : process?.difficulty === 'hard' ? '#ef444420' : '#eab30820' }]}>
            <Text style={[styles.difficultyText, { color: process?.difficulty === 'easy' ? '#22c55e' : process?.difficulty === 'hard' ? '#ef4444' : '#eab308' }]}>
              {process?.difficulty || 'moderate'}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{completedSteps.length}/{steps.length} steps</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Steps */}
      <View style={styles.stepsSection}>
        <Text style={styles.sectionTitle}>Steps</Text>
        
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isLast = index === steps.length - 1;
          
          return (
            <View key={step.id} style={styles.stepContainer}>
              {/* Timeline */}
              <View style={styles.timeline}>
                <TouchableOpacity
                  style={[
                    styles.stepCircle,
                    { backgroundColor: isCompleted ? '#22c55e' : getStepColor(step.type) + '20' }
                  ]}
                  onPress={() => toggleStep(step.id)}
                >
                  <Ionicons
                    name={isCompleted ? 'checkmark' : getStepIcon(step.type)}
                    size={18}
                    color={isCompleted ? 'white' : getStepColor(step.type)}
                  />
                </TouchableOpacity>
                {!isLast && <View style={[styles.timelineLine, isCompleted && styles.timelineLineCompleted]} />}
              </View>
              
              {/* Step Content */}
              <TouchableOpacity 
                style={[styles.stepCard, isCompleted && styles.stepCardCompleted]}
                onPress={() => toggleStep(step.id)}
                activeOpacity={0.7}
              >
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepTitle, isCompleted && styles.stepTitleCompleted]}>
                    {step.title}
                  </Text>
                  <View style={styles.stepTime}>
                    <Ionicons name="time-outline" size={12} color="#64748b" />
                    <Text style={styles.stepTimeText}>{step.time}</Text>
                  </View>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={20} color="#facc15" />
          <Text style={styles.tipText}>
            Tap any step to mark it as complete and track your progress.
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.tipText}>
            Requirements vary by state. Always check your local DMV or agency website.
          </Text>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  progressSection: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  progressValue: {
    fontSize: 14,
    color: '#64748b',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  stepsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timeline: {
    alignItems: 'center',
    width: 40,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#22c55e',
  },
  stepCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginLeft: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepCardCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  stepTitleCompleted: {
    color: '#22c55e',
  },
  stepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepTimeText: {
    fontSize: 12,
    color: '#64748b',
  },
  stepDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
  tipsSection: {
    padding: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
});
