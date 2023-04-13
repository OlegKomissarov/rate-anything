const BigLoader = () => {
    return <div className="big-loader">
        <div className="big-loader__planet">
            <div className="big-loader__ring" />
            <div className="big-loader__cover-ring" />
            <div className="big-loader__spots">
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
                <div className="big-loader__spot" />
            </div>
        </div>
        <div className="big-loader__text secondary-text">loading</div>
    </div>;
};

export default BigLoader;
