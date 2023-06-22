import React, { useState, useEffect } from 'react';

//드랍다운 메뉴 애니메이션 설정 컴포넌트
const Dropdown = props => {
    const [visibilityAnimation, setVisibilityAnimation] = useState(false);
    const [repeat, setRepeat] = useState(null);

    useEffect(() => {
        if (props.visibility) {
            //visibility가 켜졌다면 애니메이션 실행
            setVisibilityAnimation(true);
        } else {
          //꺼졌다면 애니메이션이 끝난 뒤에 없어질 수 있도록 setTimeout 설정
            setRepeat(setTimeout(() => {
                setVisibilityAnimation(false);
            }, 200));
        }
    }, [props.visibility]);

    return (
        <article className={`components-dropdown ${props.visibility ? 'slide-fade-in-dropdown' : 'slide-fade-out-dropdown'}`}>
            { visibilityAnimation && props.children }
        </article>
    )
};

export default Dropdown;