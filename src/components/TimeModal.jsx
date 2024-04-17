import '../styles/TimeModal.scss';
import React from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const TimeModal = ({ currentTime, inWork, setInWork, outWork, setOutWork, setModalOpen }) => {
  // 출퇴근 버튼 클릭 시 workTime 수정 및 inWork, outWork 변경
  const handleWorkTime = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      const userId = user.uid;
      const userRef = doc(db, 'newUsers', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        if (!inWork) {
          await updateDoc(userRef, {
            inWork: currentTime,
          });
          setInWork(true);
        }

        if (inWork && !outWork) {
          await updateDoc(userRef, {
            outWork: currentTime,
          });
          setOutWork(true);
        }
      }
    });
    setModalOpen(false);
  };

  return (
    <div className="outside">
      <div className="time-modal">
        <h3>현재 시각</h3>
        <div className="current-time">{currentTime}</div>
        <p className="description">
          {inWork ? (outWork ? '이미 퇴근하셨습니다.' : '퇴근하시겠습니까?') : '출근하시겠습니까?'}
        </p>
        <div className="btns">
          <button
            className="btn"
            type="button"
            onClick={() => handleWorkTime()}
            disabled={inWork && outWork}>
            {inWork ? (outWork ? '퇴근 완료' : '퇴근 하기') : '출근 하기'}
          </button>
          <button className="btn btn--exit" type="button" onClick={() => setModalOpen(false)}>
            취소 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;