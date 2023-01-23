/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import mockStore from "../__mocks__/store"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      const html = NewBillUI()
      document.body.innerHTML = html
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
    })

    test("Then I submit a empty form", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(datepicker.validity.valid).toBeFalsy();
    })
    test("Then I submit a form with only date", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      datepicker.value = "2023-01-06"
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeFalsy()
    })
    test("Then I submit a form with valid date and amount", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeFalsy()
    })
    test("Then I submit a form with valid date, amount and pct", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeTruthy()
      expect(file.files.length).toBe(0);
    })
    test("Then I submit a form with valid date, amount pct and bad extentions file", async () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener("change", handleChangeFile)

      const event = {
        target: {
          files: [{
            name: 'image.pdf',
            size: 50000,
            type: 'application/pdf',
          },]
        },
      }
      fireEvent.change(file, event)
      
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeTruthy()
      expect(file.files.length).toBe(0);
    })
    test("Then I submit a form with valid date, amount pct and right extentions file", async () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener("change", handleChangeFile)

      const event = {
        target: {
          files: [{
            name: 'image.png',
            size: 50000,
            type: 'image/png',
          },]
        },
      }
      fireEvent.change(file, event)
      
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeTruthy()
      expect(file.files.length).toBe(1);
      expect(file.files[0].name).toBe('image.png');
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to NewBills", () => {
    test("bills from mock API GET", async () => {
      const createBills = await mockStore.bills().create()
      expect(createBills.fileUrl).toBe("https://localhost:3456/images/test.jpg")
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
    })
    test("bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create : () =>  {
              return Promise.resolve(new Error("Erreur 404"))
            }
          }
        })
        const createBills = await mockStore.bills().create()
        expect(createBills.message).toBe("Erreur 404");
    })
    test("bills from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () =>  {
            return Promise.resolve(new Error("Erreur 500"))
          }
        }
      })
      const createBills = await mockStore.bills().create()
      expect(createBills.message).toBe("Erreur 500");
    })
  })

  })
})