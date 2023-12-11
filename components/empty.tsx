import  Image  from "next/image";

interface EmptyProps {
    label: string
}


export const Empty = ( {
    label
}: EmptyProps) => {
    return ( 
      
        <div className="h-[60vh] lg:h-[65vh] box-border  px-8 flex flex-col items-center justify-center">
            <div className="relative h-96 w-64">
                <Image alt="Empty" fill src="/empty.png" />
            </div>
            <p className="text-muted-foreground text-sm text-center pt-5"> {label}</p>
        </div>
        
        
     );
}
 
