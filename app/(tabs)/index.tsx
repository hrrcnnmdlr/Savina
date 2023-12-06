import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { vibrate } from './utils';

const PomodoroTimer = () => {
  const [initialWorkMinutes, setInitialWorkMinutes] = useState(25);
  const [initialWorkSeconds, setInitialWorkSeconds] = useState(0);
  const [initialBreakMinutes, setInitialBreakMinutes] = useState(5);
  const [initialBreakSeconds, setInitialBreakSeconds] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [isEditingBreak, setIsEditingBreak] = useState(false);

  let interval: NodeJS.Timeout;

  useEffect(() => {
    if (isActive) {
      interval = setInterval(() => {
        if (isOnBreak) {
          handleTimerTick(breakMinutes, breakSeconds, setBreakMinutes, setBreakSeconds);
        } else {
          handleTimerTick(workMinutes, workSeconds, setWorkMinutes, setWorkSeconds);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isOnBreak, workMinutes, workSeconds, breakMinutes, breakSeconds]);

  const handleTimerTick = (
    minutes: number,
    seconds: number,
    setMinutes: React.Dispatch<React.SetStateAction<number>>,
    setSeconds: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(interval);
        vibrate();
        if (isOnBreak) {
          setIsOnBreak(!isOnBreak);
        } else {
          setIsOnBreak(isOnBreak);
        }
        resetTimer();
      } else {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    } else {
      setSeconds(seconds - 1);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    // Якщо таймер не активний (не запущений), і не є паузою, то почніть таймер
    if (!isActive && !isRunning) {
      setIsActive(true);
  
      // Якщо час роботи закінчився і таймер не в режимі перерви, перейдіть в режим перерви
      if (workMinutes === 0 && workSeconds === 0 && !isOnBreak) {
        setIsOnBreak(true);
        resetTimer();
      }
      // Якщо час перерви закінчився і таймер в режимі перерви, перейдіть в режим роботи
      else if (breakMinutes === 0 && breakSeconds === 0 && isOnBreak) {
        setIsOnBreak(false);
        resetTimer();
      }
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsRunning(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    if (!isPaused) {
      setWorkMinutes(initialWorkMinutes);
      setWorkSeconds(initialWorkSeconds);
      setBreakMinutes(initialBreakMinutes);
      setBreakSeconds(initialBreakSeconds);
      setCustomMinutes('');
      setCustomSeconds('');
    } else {
      setIsPaused(false)
    }
    if (isRunning) {
      setIsOnBreak(!isOnBreak);
    } else {
      setIsOnBreak(false)
    }
  };

  const setCustomTimer = () => {
    if (
      (customMinutes && customSeconds && !isActive && !isOnBreak) ||
      (customMinutes && customSeconds && !isActive && isEditingBreak)
    ) {
      const newMinutes = parseInt(customMinutes, 10);
      const newSeconds = parseInt(customSeconds, 10);

      if (!isNaN(newMinutes) && !isNaN(newSeconds)) {
        if (isEditingBreak) {
          setBreakMinutes(newMinutes);
          setBreakSeconds(newSeconds);
          setInitialBreakMinutes(newMinutes);
          setInitialBreakSeconds(newSeconds);
        } else {
          setWorkMinutes(newMinutes);
          setWorkSeconds(newSeconds);
          setInitialWorkMinutes(newMinutes);
          setInitialWorkSeconds(newSeconds);
        }

        setCustomMinutes('');
        setCustomSeconds('');
      }
    }
  };

  const handleEditWork = () => {
    setIsEditingWork(true);
    setIsEditingBreak(false);
  };

  const handleEditBreak = () => {
    setIsEditingWork(false);
    setIsEditingBreak(true);
  };

  const handleSaveEdit = () => {
    setIsEditingWork(false);
    setIsEditingBreak(false);
    setCustomTimer();
  };

  return (
    <View style={styles.container}>
      <Text style={isOnBreak ? styles.timerText : styles.workText}>{`Work: ${workMinutes}:${workSeconds < 10 ? '0' : ''}${workSeconds}`}</Text>
      <Text style={isOnBreak ? styles.breakText : styles.timerText}>{`Break: ${breakMinutes}:${breakSeconds < 10 ? '0' : ''}${breakSeconds}`}</Text>
      <View style={styles.inputContainer}>
        {isEditingWork ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              placeholder="Minutes"
              keyboardType="numeric"
              value={customMinutes}
              onChangeText={(text) => setCustomMinutes(text)}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Seconds"
              keyboardType="numeric"
              value={customSeconds}
              onChangeText={(text) => setCustomSeconds(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleEditWork}>
            <Text style={styles.buttonText}>Edit Work</Text>
          </TouchableOpacity>
        )}
        {isEditingBreak ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              placeholder="Minutes"
              keyboardType="numeric"
              value={customMinutes}
              onChangeText={(text) => setCustomMinutes(text)}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Seconds"
              keyboardType="numeric"
              value={customSeconds}
              onChangeText={(text) => setCustomSeconds(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleEditBreak}>
            <Text style={styles.buttonText}>Edit Break</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button} onPress={isActive ? pauseTimer : toggleTimer}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    marginBottom: 10,
  },
  workText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'green',
    fontWeight: 'bold',
  },
  breakText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  editContainer: {
    alignItems: 'center',
  },
  editInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    marginRight: 10,
    width: 80,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PomodoroTimer;
