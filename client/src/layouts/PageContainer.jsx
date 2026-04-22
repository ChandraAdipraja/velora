const PageContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`mx-auto w-full max-w-md px-4 md:max-w-2xl md:px-6 lg:max-w-6xl lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;
