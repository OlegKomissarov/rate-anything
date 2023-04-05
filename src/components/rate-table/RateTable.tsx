import React, { useEffect } from 'react';
import { trpc } from '../../utils/trpcClient';
import { useInView } from 'react-intersection-observer';
import useModal from '../elements/useModal';
import UserListModal from './UserListModal';

const RateTable = () => {
    const { ref: inViewRef, inView } = useInView();
    const { toggleModal, ModalContainer } = useModal();

    const { data: averageRateList, fetchNextPage } = trpc.rate.getAverageRateList.useInfiniteQuery(
        { limit: 10, includePlainRates: true },
        { getNextPageParam: lastPage => lastPage.nextCursor }
    );

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    return <div className="rate-table custom-scrollbar">
        {
            !!averageRateList
            && averageRateList.pages.map(page =>
                <React.Fragment key={page.nextCursor || -1}>
                    {
                        page.data.map(averageRate =>
                            <React.Fragment key={averageRate.subject}>
                                <div className="rate-table__item rate-table__item--name">
                                    {averageRate.subject}
                                </div>
                                <div className="rate-table__item rate-table__item--rate">
                                    {averageRate.averageRate}
                                </div>
                                <div className="rate-table__item rate-table__item--users">
                                    <span>
                                        {averageRate.rates.at(-1)?.userName}
                                    </span>
                                    {
                                        averageRate.rates.length > 1 &&
                                        <>
                                            <span>, </span>
                                            <span onClick={toggleModal}
                                                  className="rate-table__show-more-users-button"
                                            >
                                                more...
                                            </span>
                                        </>
                                    }
                                </div>
                            </React.Fragment>
                        )
                    }
                    <ModalContainer>
                        <UserListModal />
                    </ModalContainer>
                </React.Fragment>
            )
        }
        <div ref={inViewRef} />
    </div>;
};

export default RateTable;
