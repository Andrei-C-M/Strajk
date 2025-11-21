export interface BookingRequest {
  when: string
  lanes: number
  people: number
  shoes: number[]
}


//BookingResponse tar emot fält från BookingRequest och lägger till price, id och active
export interface BookingResponse extends BookingRequest {
  price: number
  id: string
  active: boolean
}

export interface BookingFormValues {
  date: string
  time: string
  lanes: number
  people: number
  shoes: number[]
}

