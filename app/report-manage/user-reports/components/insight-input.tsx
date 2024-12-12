import { Text, HStack, Input, Button } from '@chakra-ui/react';

interface InsightInputProps {
  insight: string | undefined;
  onUpdate: (insight: string) => void;
  onSave: () => void;
}

export default function InsightInput({
  insight,
  onUpdate,
  onSave,
}: InsightInputProps) {
  return (
    <>
      <Text
        fontWeight='bold'
        fontSize='md'
        marginBottom={2}
        alignSelf='flex-start'
      >
        Insight
      </Text>
      <HStack width='100%' spacing={4}>
        <Input
          placeholder='Enter your insight'
          defaultValue={insight}
          height='100px'
          flex='1'
          onChange={(e) => onUpdate(e.target.value)}
        />
        <Button
          colorScheme='blue'
          height='100px'
          width='100px'
          onClick={onSave}
        >
          Save
        </Button>
      </HStack>
    </>
  );
}
