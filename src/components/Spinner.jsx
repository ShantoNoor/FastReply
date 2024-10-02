const Spinner = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full">
      <div className="size-5 rounded-full animate-pulse bg-primary"></div>

      <div className="flex items-center justify-center gap-2">
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
        <div className="size-5 rounded-full border-[3px] border-dashed animate-spin border-primary"></div>
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
        <div className="size-5 rounded-full border-[3px] border-dashed animate-spin border-primary"></div>
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
        <div className="size-5 rounded-full border-[3px] border-dashed animate-spin border-primary"></div>
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
        <div className="size-5 rounded-full border-[3px] border-dashed animate-spin border-primary"></div>
        <div className="size-5 rounded-full animate-pulse bg-primary"></div>
      </div>

      <div className="size-5 rounded-full animate-pulse bg-primary"></div>
    </div>
  );
};

export default Spinner;
