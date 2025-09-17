const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto max-w-[90%] xl:max-w-[1024px]">{children}</div>
}

export default Container
