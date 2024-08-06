import { Text, View, TextInput, type TextInputProps } from 'react-native';
import { colors } from '~/theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  right?: () => JSX.Element;
  onClearError?: () => void;
}

export default function Input({ label, errorMessage, right, onClearError, ...props }: InputProps) {
  return (
    <View className="">
      {label && (
        <Text
          className={` ${styles.label} " font-normal"`}
          style={{
            color: errorMessage ? colors.error : '#1A1A1A',
          }}>
          {label}
          <Text style={{ color: colors.error }}>*</Text>
        </Text>
      )}
      <View className={`${styles.inputBox} ${errorMessage !== null && styles.errorBorder}`}>
        <TextInput
          {...props}
          keyboardType={label?.toLowerCase().includes('email') ? 'email-address' : 'default'}
          className={`${styles.input} placeholder:text-zinc-400`}
          onFocus={() => {
            if (onClearError) onClearError();
          }}
        />
        {right && <View className={styles.icon}>{right()}</View>}
      </View>

      {errorMessage && <Text className={styles.error}>{errorMessage}</Text>}
    </View>
  );
}
const styles = {
  error: ` text-red-500 mt-2 font-normal`,
  errorBorder: 'border-2 border-error',
  inputBox: ' h-14 items-center justify-center pl-3  flex-row border-1 border-[#A1A5AC] rounded-md',
  input: 'w-full font-normal',
  label: 'my-1.5 font-normal text-base',
  icon: 'justify-center items-center absolute right-3',
  button: 'items-center bg-primary rounded-md shadow-md p-4',
  buttonText: 'text-white text-lg font-semibold text-center',
};
