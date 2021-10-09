import { StyleSheet } from 'react-native';
import { theme } from './color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 28,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 20,
    fontSize: 16,
  },
  toDo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  toDoText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.white,
  },
});
