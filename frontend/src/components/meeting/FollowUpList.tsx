
type FollowUpListProps ={
    title: string
    items: string[]
}

export default function FollowUpList ({title, items}: FollowUpListProps) {
    if (items.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            <h4 className="font-medium">{title}</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {items.map((item,index) => (
                    <li key={index}> {item} </li>
                ) )}
            </ul>
        </div>
    )

}