import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/pt-br"
import { IconButton } from "./IconButton"
import { Table } from "./table/Table"
import { TableHeader } from "./table/TableHeader"
import { TableCell } from "./table/TableCell"
import { TableRow } from "./table/TableRow"
import { ChangeEvent, useEffect, useState } from "react"

dayjs.extend(relativeTime)
dayjs.locale("pt-br")

interface Attendee {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList() {
    const [searchInput, setSearchInput] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has("search")) {
            return url.searchParams.get("search") ?? ""
        }

        return ""
    })
    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has("page")) {
            return Number(url.searchParams.get("page"))
        }

        return 1
    })
    const [total, setTotal] = useState(0)
    const [attendees, setAttendees] = useState<Attendee[]>([])

    const totalPages = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL("http://localhost:3333/events/005831fa-6fd3-40c6-980e-a2c3db5eb756/attendees")

        url.searchParams.set("pageIndex", String(page - 1))
        searchInput.length > 0 && url.searchParams.set("query", searchInput)

        fetch(url)
            .then(res => res.json())
            .then(({ attendees, total }) => { 
                setAttendees(attendees)
                setTotal(total)
            })
    }, [page, searchInput])

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())

        url.searchParams.set("search", search)

        window.history.pushState({}, "", url)

        setSearchInput(search)
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())

        url.searchParams.set("page", String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function goToFirstPage() {
        setCurrentPage(1)
    }

    function goToPreviousPage() {
        setCurrentPage(page - 1)
    }

    function goToNextPage() {
        setCurrentPage(page + 1)
    }

    function goToLastPage() {
        setCurrentPage(totalPages)
    }
    

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg text-sm flex items-center gap-3">
                    <Search className="size-4 text-emerald-300" />
                    <input onChange={onSearchInputChanged} value={searchInput} className="p-0 border-0 bg-transparent flex-1 outline-none focus:ring-0" placeholder="Buscar participante..." />
                </div>
            </div>

            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <TableHeader style={{ width: 48 }}>
                            <input type="checkbox" className="size-4 bg-black/20 rounded border-white/10" />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} />
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id}>
                                <TableCell>
                                    <input type="checkbox" className="size-4 bg-black/20 rounded border-white/10" />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-white">{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{
                                    attendee.checkedInAt
                                        ? dayjs().to(attendee.checkedInAt)
                                        : <span className="text-zinc-400">Não realizado</span>
                                }</TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {total} itens
                        </TableCell>
                        <td className="py-3 px-4 text-sms text-zinc-300 text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span>Página {page} de {totalPages}</span>

                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}