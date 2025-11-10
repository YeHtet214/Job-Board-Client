const Progress = ({ value }: { value: number }) => {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Profile completion</p>
                <p className="text-sm font-medium">{value}%</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-jb-primary rounded-full"
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    )
}

export default Progress
