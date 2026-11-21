import { useState } from 'react';
import BottomButton from '@/components/common/BottomButton';
import { IconInfo } from '@/components/common/icons';
import { useAddChore } from '@/hooks/useHouseSettings';
import UnderlineInput from '@/pages/onboarding/components/UnderlineInput';
import { INPUT_RULES, isValidText } from '@/pages/onboarding/validation';
import { useToastStore } from '@/stores/toast';
import BottomSheet from './BottomSheet';

/** V5-13 집안일 추가 (권한: 모두). 추가한 일은 내 짐으로 들어감 */
function AddChoreSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const addChore = useAddChore();
  const showToast = useToastStore((s) => s.show);

  const canSubmit = isValidText(name, INPUT_RULES.choreName) && !addChore.isPending;

  const submit = () =>
    addChore.mutate(name.trim(), {
      onSuccess: () => {
        showToast('집안일을 추가했어요');
        onClose();
      },
      // 실패 시 입력값을 그대로 두고 토스트
      onError: () => showToast('추가하지 못했어요. 다시 시도해주세요'),
    });

  return (
    <BottomSheet
      title="집안일 추가"
      onClose={onClose}
      footer={
        <BottomButton variant="solid" disabled={!canSubmit} onClick={submit}>
          {addChore.isPending ? '추가하는 중' : '추가하기'}
        </BottomButton>
      }
    >
      <UnderlineInput
        className="mt-6"
        label="이름"
        value={name}
        onChange={setName}
        maxLength={INPUT_RULES.choreName.max}
        placeholder="베란다 청소"
        autoFocus
      />
      <p className="mt-3 flex gap-2 text-sm text-gray-500">
        <IconInfo size={16} className="mt-0.5 shrink-0" />
        <span>
          추가한 일은 내 짐으로 들어가요.
          <br />
          힘들면 짐 올리기로 부탁할 수 있어요.
        </span>
      </p>
    </BottomSheet>
  );
}

export default AddChoreSheet;
