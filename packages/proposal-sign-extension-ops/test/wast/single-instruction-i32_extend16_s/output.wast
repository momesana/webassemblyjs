(module
  (func (param i32) (result i32)
    (get_local 0)
    (call 1)
  )
  (func (param i32) (result i32)
    (get_local 0)
    (i32.const -32768)
    (i32.or)
    (get_local 0)
    (i32.const 32767)
    (i32.and)
    (get_local 0)
    (i32.const 32768)
    (i32.and)
    (i32.const 15)
    (i32.shr_u)
    (select)
  )
)

